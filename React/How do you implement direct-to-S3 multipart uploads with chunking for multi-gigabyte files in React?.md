***  How do you implement direct-to-S3 multipart uploads with chunking for multi-gigabyte files in React?.md ***

For files exceeding 100MB up to several gigabytes/terabytes, a single presigned `PUT` URL is vulnerable to network drops and S3's 5GB single-PUT limit.

The **direct-to-S3 Multipart Upload** pattern divides a large file into fixed-size chunks (e.g., 5MB–10MB), uploads multiple chunks in parallel directly from the browser to S3, and stitches them together once all parts succeed.

---

### Workflow Architecture

```
[Browser Client] ── 1. createMultipartUpload(fileName, fileType) ──▶ [Server Action] (S3: CreateMultipartUpload)
[Browser Client] ◀─ Returns { uploadId, key } ──────────────────────┘
       │
       ├── 2. Slice File into 5MB chunks
       ├── 3. For each part: getPresignedPartUrl(key, uploadId, partNumber) ──▶ [Server Action]
       ├── 4. Upload parts directly to S3 in parallel (concurrency limit = 3-5)
       │      └── Collect { ETag, PartNumber } from each S3 response header
       │
[Browser Client] ── 5. completeMultipartUpload(key, uploadId, parts) ──▶ [Server Action] (S3: CompleteMultipartUpload)
[Browser Client] ◀─ Final confirmed S3 Key / Public URL ─────────────┘

```

---

### Step 1: Server Actions for Multipart Lifecycle

Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`. These actions handle upload initialization, signing individual chunk URLs, and finalizing or aborting the upload.

```typescript
// app/actions/s3MultipartActions.ts
'use server';

import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CompletedPart,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

// 1. Initialize Multipart Upload
export async function startMultipartUpload({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) {
  const key = `multipart/${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const response = await s3.send(command);
  return { uploadId: response.UploadId!, key };
}

// 2. Sign a specific part (1-indexed)
export async function getPresignedPartUrl({
  key,
  uploadId,
  partNumber,
}: {
  key: string;
  uploadId: string;
  partNumber: number;
}) {
  const command = new UploadPartCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  // URL valid for 15 minutes per chunk
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  return { presignedUrl };
}

// 3. Assemble all parts into the final file
export async function finalizeMultipartUpload({
  key,
  uploadId,
  parts,
}: {
  key: string;
  uploadId: string;
  parts: CompletedPart[];
}) {
  // S3 requires parts to be strictly sorted by PartNumber ascending
  const sortedParts = [...parts].sort((a, b) => (a.PartNumber ?? 0) - (b.PartNumber ?? 0));

  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: sortedParts },
  });

  await s3.send(command);

  return {
    key,
    publicUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
}

// 4. Clean up in-flight chunks if canceled or aborted
export async function cancelMultipartUpload({
  key,
  uploadId,
}: {
  key: string;
  uploadId: string;
}) {
  const command = new AbortMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
  });
  await s3.send(command);
}

```

---

### Step 2: Bucket CORS Configuration

S3 requires the `ETag` header exposed so client JavaScript can read the cryptographic hash returned after each chunk uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]

```

---

### Step 3: Client Chunking Engine with Concurrency & Pause/Cancel

AWS S3 imposes a **minimum part size of 5 MB** (except for the last part). We slice the `File` using `File.prototype.slice()` and control parallel uploads using a worker pool (e.g., 4 concurrent chunk uploads).

```tsx
'use client';

import React, { useState, useRef } from 'react';
import {
  startMultipartUpload,
  getPresignedPartUrl,
  finalizeMultipartUpload,
  cancelMultipartUpload,
} from './actions/s3MultipartActions';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB per part (S3 minimum)
const CONCURRENCY_LIMIT = 4;        // Parallel streams

export function MultiGigabyteUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);

  // References for tracking and aborting
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeUploadRef = useRef<{ key: string; uploadId: string } | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setCompletedUrl(null);
    abortControllerRef.current = new AbortController();

    try {
      // 1. Initialize upload on S3
      const { uploadId, key } = await startMultipartUpload({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
      });
      activeUploadRef.current = { key, uploadId };

      // 2. Compute total parts
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);
      const completedParts: { ETag: string; PartNumber: number }[] = [];
      const uploadedBytesPerPart = new Array(totalParts).fill(0);

      // 3. Create work queue
      const partQueue = Array.from({ length: totalParts }, (_, i) => i + 1);

      // 4. Worker function for parallel execution
      const uploadWorker = async () => {
        while (partQueue.length > 0) {
          if (abortControllerRef.current?.signal.aborted) throw new Error('Aborted');

          const partNumber = partQueue.shift()!;
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunkBlob = file.slice(start, end);

          // Get presigned URL for this specific chunk
          const { presignedUrl } = await getPresignedPartUrl({ key, uploadId, partNumber });

          // Upload chunk and capture ETag
          const eTag = await uploadChunkWithRetry({
            url: presignedUrl,
            chunk: chunkBlob,
            signal: abortControllerRef.current!.signal,
            onProgress: (bytesLoaded) => {
              uploadedBytesPerPart[partNumber - 1] = bytesLoaded;
              const totalLoaded = uploadedBytesPerPart.reduce((acc, curr) => acc + curr, 0);
              setProgress(Math.min(99, Math.round((totalLoaded / file.size) * 100)));
            },
          });

          completedParts.push({ PartNumber: partNumber, ETag: eTag });
        }
      };

      // 5. Run parallel workers
      const workers = Array.from(
        { length: Math.min(CONCURRENCY_LIMIT, totalParts) },
        () => uploadWorker()
      );
      await Promise.all(workers);

      // 6. Complete Multipart Upload
      const result = await finalizeMultipartUpload({ key, uploadId, parts: completedParts });
      setProgress(100);
      setCompletedUrl(result.publicUrl);
    } catch (err: any) {
      if (activeUploadRef.current) {
        await cancelMultipartUpload(activeUploadRef.current);
      }
      alert(err.message === 'Aborted' ? 'Upload canceled' : `Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      activeUploadRef.current = null;
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div className="max-w-md p-6 border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Multi-GB File Uploader</h2>

      <input
        type="file"
        disabled={uploading}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
      />

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-600">{progress}% complete</p>
        </div>
      )}

      {completedUrl && (
        <p className="text-sm text-green-600 font-medium break-all">
          ✓ File uploaded: <a href={completedUrl} className="underline" target="_blank">{completedUrl}</a>
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Start Multipart Upload'}
        </button>

        {uploading && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-red-500 text-red-500 rounded font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// Helper: Upload a single chunk with XHR (to extract ETag and track progress)
function uploadChunkWithRetry({
  url,
  chunk,
  signal,
  onProgress,
}: {
  url: string;
  chunk: Blob;
  signal: AbortSignal;
  onProgress: (loaded: number) => void;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);

    const onAbort = () => {
      xhr.abort();
      reject(new Error('Aborted'));
    };
    signal.addEventListener('abort', onAbort);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };

    xhr.onload = () => {
      signal.removeEventListener('abort', onAbort);
      if (xhr.status >= 200 && xhr.status < 300) {
        // S3 returns ETag wrapped in quotes: '"d41d8cd98f00b204e9800998ecf8427e"'
        const rawETag = xhr.getResponseHeader('ETag');
        if (!rawETag) {
          reject(new Error('ETag missing in S3 response header. Check CORS configuration.'));
          return;
        }
        resolve(rawETag.replace(/['"]/g, ''));
      } else {
        reject(new Error(`Chunk upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      reject(new Error('Network error on chunk upload'));
    };

    xhr.send(chunk);
  });
}

```

---

### Critical Production Optimizations

* **S3 Lifecycle Rules (AbortIncompleteMultipartUpload):** If a user closes the browser tab mid-upload, S3 retains uploaded chunks indefinitely, racking up storage costs. Set an S3 Lifecycle Rule on the bucket to automatically delete incomplete multipart uploads after **1 to 3 days**.
* **ETag Format Stripping:** S3's `ETag` response header includes surrounding quotes (e.g., `"\"2b34a...\""`). Pass the clean alphanumeric hash string to `finalizeMultipartUpload`.
* **Chunk Retry Mechanism:** For unstable mobile connections, wrap individual chunk uploads in an exponential backoff loop (up to 3 retries) before failing the entire upload.
