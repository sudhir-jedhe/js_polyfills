*** copy How do you implement direct-to-S3 presigned URL uploads with React 19 Server Actions to bypass server payload limits?.md ***

Uploading large files directly through Server Actions routes heavy binary payloads through your server, consuming bandwidth and easily exceeding default request body size limits (e.g., Next.js's default 1MB cap).

The **direct-to-S3 presigned URL pattern** bypasses server payload limits:

1. The client asks the Server Action for a secure, short-lived **presigned S3 `PUT` URL** (sending only lightweight metadata like filename, file type, and size).
2. The browser uploads the raw binary file directly to S3 via `fetch(presignedUrl, { method: 'PUT', body: file })`.
3. The client submits the final form (with the permanent S3 object URL/key) via a standard Server Action.

---

### Architecture Overview

```
[Browser Client] ── 1. getPresignedUrl({ filename, fileType }) ──▶ [Server Action]
                                                                        │ (Calls AWS SDK)
[Browser Client] ◀─ 2. Returns { presignedUrl, publicUrl, key } ◀───────┘
       │
       └── 3. Direct Binary PUT upload (Bypasses Next.js server entirely) ──▶ [Amazon S3 Bucket]
                                                                                   │
[Browser Client] ── 4. completeFormAction({ name, s3Key, ... }) ──▶ [Server Action] (Persists record to DB)

```

---

### Step 1: Server Action to Generate the Presigned URL

Use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` on the server:

```typescript
// app/actions/s3Actions.ts
'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function getPresignedUploadUrl({
  fileName,
  fileType,
  fileSize,
}: {
  fileName: string;
  fileType: string;
  fileSize: number;
}) {
  // 1. Server-side validation
  if (!ALLOWED_MIME_TYPES.includes(fileType)) {
    throw new Error('Unsupported file type');
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error('File exceeds the 100MB limit');
  }

  // 2. Generate a secure, unique object key
  const uniqueKey = `uploads/${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // 3. Create the S3 PutObject command
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: uniqueKey,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  // 4. Generate URL expiring in 5 minutes (300 seconds)
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return {
    presignedUrl,
    key: uniqueKey,
    publicUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`,
  };
}

```

---

### Step 2: S3 Bucket CORS Configuration

Your S3 bucket must accept direct `PUT` requests originating from your web domain. Apply this CORS policy to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]

```

---

### Step 3: Client Component with Upload Progress & Action State

The component handles selecting the file, requesting the presigned URL, uploading directly to S3 with `XMLHttpRequest` or `fetch`, and submitting the final payload.

```tsx
'use client';

import { useState, useTransition } from 'react';
import { getPresignedUploadUrl } from './actions/s3Actions';

export function DirectS3Uploader({
  onUploadComplete,
}: {
  onUploadComplete: (s3Key: string, publicUrl: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'signing' | 'uploading' | 'saving' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProgress(0);
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      // Step 1: Request presigned URL from the Server Action
      setStatus('signing');
      const { presignedUrl, key, publicUrl } = await getPresignedUploadUrl({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Step 2: Upload directly to S3 using XHR for accurate progress tracking
      setStatus('uploading');
      await uploadToS3WithProgress(presignedUrl, file, (percent) => {
        setProgress(percent);
      });

      // Step 3: Run final Server Action transition to store metadata in DB
      setStatus('saving');
      startTransition(async () => {
        await onUploadComplete(key, publicUrl);
        setStatus('done');
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-md p-6 border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-bold">Direct S3 Upload</h3>

      <form onSubmit={handleUploadAndSubmit} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={status === 'uploading' || status === 'signing' || isPending}
          className="w-full border p-2 rounded"
        />

        {/* Progress Bar */}
        {(status === 'uploading' || status === 'saving') && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              {status === 'saving' ? 'Saving record...' : `${progress}% uploaded`}
            </p>
          </div>
        )}

        {status === 'done' && (
          <p className="text-sm text-green-600 font-medium">✓ Upload and processing complete!</p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={!file || status === 'uploading' || status === 'signing' || isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded disabled:opacity-50"
        >
          {status === 'signing' && 'Getting authorization...'}
          {status === 'uploading' && 'Uploading directly to S3...'}
          {status === 'saving' && 'Finalizing...'}
          {(status === 'idle' || status === 'done' || status === 'error') && 'Start Upload'}
        </button>
      </form>
    </div>
  );
}

// XHR wrapper for tracking upload progress
function uploadToS3WithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 responded with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during direct S3 upload'));
    xhr.send(file);
  });
}

```

---

### Core Advantages & Security Considerations

* **Bypasses Server Ingress:** Large 100MB+ video or document uploads stream straight into AWS S3 storage; your Node.js or Edge application servers consume zero memory buffering binaries.
* **Strict MIME Validation:** Always assert `ContentType` in both the server-side `PutObjectCommand` and the client `PUT` headers. S3 will reject the upload with a signature mismatch if the client tries to upload a different file type than authorized.
* **Orphan Cleanup:** If a user requests a presigned URL but closes their tab midway through uploading, configure an **S3 Lifecycle Rule** on the bucket to automatically expire and delete incomplete multipart uploads or objects in the `uploads/temp/` folder after 24–48 hours.
