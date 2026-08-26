Uploading large files (e.g., >100MB up to several gigabytes) directly to Amazon S3 requires **S3 Multipart Uploads**. Standard single `PUT` presigned URLs often time out or fail completely if network connectivity drops mid-upload.

With multipart uploads:

1. The browser slices the file into chunks (minimum 5MB per chunk, except the last).
2. Each chunk is uploaded in parallel directly to S3 via individual presigned URLs.
3. If one chunk fails, only that chunk needs a retry (not the entire multi-gigabyte file).
4. Once all chunks finish, a Server Action tells S3 to assemble the chunks into the final object.

---

### Architecture & Lifecycle Flow

```
[Browser Client]
       │
       ├── 1. Calls `initiateMultipartUploadAction()`
       │      └── Server creates S3 upload session ──▶ returns `{ uploadId, fileKey }`
       │
       ├── 2. Calculates chunk slices (e.g. 10MB chunks)
       │
       ├── 3. Calls `getMultipartPresignedUrlsAction({ uploadId, fileKey, totalParts })`
       │      └── Server returns signed PUT URLs for Part 1, Part 2, ... Part N
       │
       ├── 4. Client uploads parts concurrently to S3 (Pool of 3-4 parallel requests)
       │      └── S3 returns an `ETag` header per completed chunk
       │
       ├── 5. Calls `completeMultipartUploadAction({ uploadId, fileKey, parts: [{ PartNumber, ETag }] })`
       │      └── S3 joins chunks into the final permanent file
       │
       └── (Optional fallback) `abortMultipartUploadAction()` cleans up if user cancels

```

---

### Step 1: Server Actions for Multipart Lifecycle

Using `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`, define four coordinated Server Actions:

```typescript
// app/actions/s3-multipart.ts
'use server';

import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  type CompletedPart,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 1. Initialize Multipart Session
export async function initiateMultipartUploadAction(fileName: string, fileType: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `uploads/multipart/${crypto.randomUUID()}-${cleanFileName}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  const { UploadId } = await s3.send(command);
  if (!UploadId) throw new Error('Failed to initialize multipart upload');

  return { uploadId: UploadId, fileKey };
}

// 2. Batch Generate Presigned Part URLs
export async function getMultipartPresignedUrlsAction({
  fileKey,
  uploadId,
  partNumbers,
}: {
  fileKey: string;
  uploadId: string;
  partNumbers: number[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const presignedUrls = await Promise.all(
    partNumbers.map(async (partNumber) => {
      const command = new UploadPartCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      // 15-minute validity per chunk
      const url = await getSignedUrl(s3, command, { expiresIn: 900 });
      return { partNumber, url };
    })
  );

  return presignedUrls;
}

// 3. Assemble and Finalize Chunks
export async function completeMultipartUploadAction({
  fileKey,
  uploadId,
  parts,
}: {
  fileKey: string;
  uploadId: string;
  parts: CompletedPart[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // S3 requires parts sorted by PartNumber in ascending order
  const sortedParts = [...parts].sort((a, b) => (a.PartNumber ?? 0) - (b.PartNumber ?? 0));

  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    UploadId: uploadId,
    MultipartUpload: { Parts: sortedParts },
  });

  const result = await s3.send(command);
  return { success: true, location: result.Location, fileKey };
}

// 4. Abort / Cancel Clean-up
export async function abortMultipartUploadAction({
  fileKey,
  uploadId,
}: {
  fileKey: string;
  uploadId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await s3.send(
    new AbortMultipartUploadCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      UploadId: uploadId,
    })
  );

  return { aborted: true };
}

```

---

### Step 2: Client Multipart Engine with Concurrency & Progress

The browser splits the file into slices using `file.slice(start, end)` and uploads chunks using a concurrency pool to prevent network congestion.

```typescript
// lib/multipart-uploader.ts
import {
  initiateMultipartUploadAction,
  getMultipartPresignedUrlsAction,
  completeMultipartUploadAction,
  abortMultipartUploadAction,
} from '@/app/actions/s3-multipart';
import type { CompletedPart } from '@aws-sdk/client-s3';

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk (minimum S3 allowed is 5MB)
const CONCURRENCY_LIMIT = 4; // Max parallel chunk uploads

export interface UploadProgress {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
}

export async function uploadLargeFileToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
  abortSignal?: AbortSignal
) {
  // 1. Calculate chunk ranges
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

  // 2. Start S3 session
  const { uploadId, fileKey } = await initiateMultipartUploadAction(file.name, file.type);

  try {
    // 3. Obtain presigned URLs in a single batch
    const urlList = await getMultipartPresignedUrlsAction({
      fileKey,
      uploadId,
      partNumbers,
    });
    const urlMap = new Map(urlList.map((item) => [item.partNumber, item.url]));

    const completedParts: CompletedPart[] = [];
    let uploadedBytes = 0;

    // Helper: Upload single slice with retry
    const uploadChunk = async (partNumber: number): Promise<void> => {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);
      const url = urlMap.get(partNumber)!;

      const response = await fetch(url, {
        method: 'PUT',
        body: chunkBlob,
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`Failed uploading chunk #${partNumber}: ${response.statusText}`);
      }

      // S3 returns ETag wrapped in quotes (e.g. '"d41d8cd98f00b204e9800998ecf8427e"')
      const etag = response.headers.get('ETag');
      if (!etag) throw new Error(`Missing ETag for chunk #${partNumber}`);

      completedParts.push({
        PartNumber: partNumber,
        ETag: etag.replace(/"/g, ''), // Strip quotes if necessary
      });

      uploadedBytes += (end - start);
      if (onProgress) {
        onProgress({
          percentage: Math.round((uploadedBytes / file.size) * 100),
          uploadedBytes,
          totalBytes: file.size,
        });
      }
    };

    // 4. Run chunk uploads through a worker pool
    const queue = [...partNumbers];
    const workers = Array.from({ length: CONCURRENCY_LIMIT }, async () => {
      while (queue.length > 0) {
        if (abortSignal?.aborted) throw new Error('Upload aborted by user');
        const nextPart = queue.shift();
        if (nextPart !== undefined) {
          await uploadChunk(nextPart);
        }
      }
    });

    await Promise.all(workers);

    // 5. Tell S3 to assemble all parts
    const completion = await completeMultipartUploadAction({
      fileKey,
      uploadId,
      parts: completedParts,
    });

    return completion;
  } catch (error) {
    // If upload was canceled or failed, clean up orphaned parts in S3
    await abortMultipartUploadAction({ fileKey, uploadId }).catch(() => null);
    throw error;
  }
}

```

---

### Step 3: React 19 UI Component with Progress & Cancellation

```tsx
// app/components/LargeFileUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { uploadLargeFileToS3, type UploadProgress } from '@/lib/multipart-uploader';

export function LargeFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [completedKey, setCompletedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setCompletedKey(null);
      setErrorMessage(null);
      setProgress(null);
    }
  };

  const handleStartUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await uploadLargeFileToS3(
        file,
        (p) => setProgress(p),
        abortControllerRef.current.signal
      );

      setCompletedKey(result.fileKey);
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        setErrorMessage('Upload cancelled.');
      } else {
        setErrorMessage(err.message || 'Failed to complete multipart upload.');
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Large File Upload (Multipart)</h3>

      <input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {file && (
        <p className="text-xs text-gray-500">
          Selected: <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(1)} MB)
        </p>
      )}

      {/* Progress Bar */}
      {isUploading && progress && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Uploading in parallel chunks...</span>
            <span className="font-semibold">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-150"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Success State */}
      {completedKey && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
          ✅ File uploaded and assembled successfully!
          <div className="font-mono text-[11px] truncate mt-1">{completedKey}</div>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 pt-2">
        {!isUploading ? (
          <button
            onClick={handleStartUpload}
            disabled={!file}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
          >
            Start Upload
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
          >
            Cancel Upload
          </button>
        )}
      </div>
    </div>
  );
}

```

---

### Critical Production Rules for S3 Multipart

* **S3 CORS `ExposeHeaders` Requirement:** S3 returns the part identifier via the `ETag` response header. You **must** expose `ETag` in your bucket's CORS configuration; otherwise, JavaScript in the browser cannot read `response.headers.get('ETag')`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]

```

* **Auto-Prune Incomplete Multipart Uploads (Lifecycle Rule):** If an upload is abandoned mid-way without calling `AbortMultipartUpload`, S3 still stores the uploaded parts and bills storage fees. Create an S3 Lifecycle Rule configured to:

$$\text{Abort incomplete multipart uploads after } 1\text{ to } 7\text{ days}$$

* **Minimum Part Size Limit:** S3 rejects parts smaller than 5MB ($5{,}242{,}880\text{ bytes}$), except for the very last part of the file. A chunk size between 10MB and 25MB offers the ideal balance between memory consumption and parallel network throughput.
