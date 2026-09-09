***  How do you store in-flight S3 multipart upload tokens in IndexedDB to resume paused or dropped uploads after page refresh?.md ***

To make S3 multipart uploads resumable across browser sessions, crashes, or page reloads, you must persist two things:

1. **The Upload Session Metadata in IndexedDB:** Stores `uploadId`, `key`, `fileName`, `fileSize`, `lastModified`, and the array of already completed `{ PartNumber, ETag }` chunks.
2. **File Fingerprinting:** Generates a deterministic key (e.g., `${file.name}-${file.size}-${file.lastModified}`) to detect if a selected file has an active, incomplete session in IndexedDB.

When the user re-selects the file (or the file is retrieved via persistent File System Handles), the uploader skips already uploaded parts and only requests presigned URLs for missing chunks.

---

### Step 1: IndexedDB Storage Helper

Using standard `IndexedDB` (or a lightweight wrapper like `idb`), create a store to save and update upload progress after every uploaded chunk:

```typescript
// utils/uploadStorage.ts

export interface CompletedPart {
  PartNumber: number;
  ETag: string;
}

export interface InFlightUpload {
  fileId: string;       // Fingerprint: `${name}-${size}-${lastModified}`
  fileName: string;
  fileSize: number;
  uploadId: string;
  key: string;
  parts: CompletedPart[];
  updatedAt: number;
}

const DB_NAME = 'S3UploadResumeDB';
const STORE_NAME = 'active_uploads';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'fileId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUploadSession(session: InFlightUpload): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(session);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUploadSession(fileId: string): Promise<InFlightUpload | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(fileId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function updateUploadedPart(fileId: string, part: CompletedPart): Promise<void> {
  const session = await getUploadSession(fileId);
  if (!session) return;

  session.parts.push(part);
  session.updatedAt = Date.now();
  await saveUploadSession(session);
}

export async function clearUploadSession(fileId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(fileId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

```

---

### Step 2: Server Actions

You reuse the standard S3 multipart Server Actions (`startMultipartUpload`, `getPresignedPartUrl`, `finalizeMultipartUpload`, and `cancelMultipartUpload`):

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

export async function startMultipartUpload({ fileName, fileType }: { fileName: string; fileType: string }) {
  const key = `multipart/${crypto.randomUUID()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const res = await s3.send(new CreateMultipartUploadCommand({ Bucket: BUCKET, Key: key, ContentType: fileType }));
  return { uploadId: res.UploadId!, key };
}

export async function getPresignedPartUrl({ key, uploadId, partNumber }: { key: string; uploadId: string; partNumber: number }) {
  const command = new UploadPartCommand({ Bucket: BUCKET, Key: key, UploadId: uploadId, PartNumber: partNumber });
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  return { presignedUrl };
}

export async function finalizeMultipartUpload({ key, uploadId, parts }: { key: string; uploadId: string; parts: CompletedPart[] }) {
  const sortedParts = [...parts].sort((a, b) => (a.PartNumber ?? 0) - (b.PartNumber ?? 0));
  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: sortedParts },
    })
  );
  return { key, publicUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` };
}

export async function cancelMultipartUpload({ key, uploadId }: { key: string; uploadId: string }) {
  await s3.send(new AbortMultipartUploadCommand({ Bucket: BUCKET, Key: key, UploadId: uploadId }));
}

```

---

### Step 3: Resumable Upload Component

When a file is selected, the component checks IndexedDB for an existing session matching the file's fingerprint:

```tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  startMultipartUpload,
  getPresignedPartUrl,
  finalizeMultipartUpload,
  cancelMultipartUpload,
} from './actions/s3MultipartActions';
import {
  getUploadSession,
  saveUploadSession,
  updateUploadedPart,
  clearUploadSession,
  InFlightUpload,
} from './utils/uploadStorage';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks (S3 minimum)
const CONCURRENCY = 3;

export function ResumableS3Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [existingSession, setExistingSession] = useState<InFlightUpload | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateFileId = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

  // Check IndexedDB when a file is picked
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setCompletedUrl(null);

    if (selectedFile) {
      const fileId = generateFileId(selectedFile);
      const session = await getUploadSession(fileId);

      if (session && session.parts.length > 0) {
        setExistingSession(session);
        const totalParts = Math.ceil(selectedFile.size / CHUNK_SIZE);
        const initialPercent = Math.round((session.parts.length / totalParts) * 100);
        setProgress(initialPercent);
      } else {
        setExistingSession(null);
        setProgress(0);
      }
    }
  };

  const handleStartOrResumeUpload = async () => {
    if (!file) return;

    setUploading(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const fileId = generateFileId(file);
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);

    try {
      let uploadId: string;
      let key: string;
      let completedParts: { PartNumber: number; ETag: string }[] = [];

      // 1. Resume from existing session OR initialize a fresh one
      const existing = await getUploadSession(fileId);
      if (existing) {
        uploadId = existing.uploadId;
        key = existing.key;
        completedParts = [...existing.parts];
      } else {
        const init = await startMultipartUpload({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
        });
        uploadId = init.uploadId;
        key = init.key;

        await saveUploadSession({
          fileId,
          fileName: file.name,
          fileSize: file.size,
          uploadId,
          key,
          parts: [],
          updatedAt: Date.now(),
        });
      }

      // 2. Filter out parts that have already been uploaded
      const completedSet = new Set(completedParts.map((p) => p.PartNumber));
      const remainingPartNumbers = Array.from({ length: totalParts }, (_, i) => i + 1).filter(
        (partNumber) => !completedSet.has(partNumber)
      );

      // Track loaded bytes across all parts for smooth progress
      const uploadedBytesMap = new Map<number, number>();
      completedParts.forEach((p) => {
        uploadedBytesMap.set(p.PartNumber, CHUNK_SIZE);
      });

      // 3. Worker queue for remaining parts
      const queue = [...remainingPartNumbers];

      const uploadWorker = async () => {
        while (queue.length > 0) {
          if (signal.aborted) throw new Error('Paused');

          const partNumber = queue.shift()!;
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunkBlob = file.slice(start, end);

          // Get presigned URL for this chunk
          const { presignedUrl } = await getPresignedPartUrl({ key, uploadId, partNumber });

          // Upload chunk & capture ETag
          const eTag = await uploadChunk({
            url: presignedUrl,
            chunk: chunkBlob,
            signal,
            onProgress: (loaded) => {
              uploadedBytesMap.set(partNumber, loaded);
              const totalBytesLoaded = Array.from(uploadedBytesMap.values()).reduce((a, b) => a + b, 0);
              setProgress(Math.min(99, Math.round((totalBytesLoaded / file.size) * 100)));
            },
          });

          const completedPart = { PartNumber: partNumber, ETag: eTag };
          completedParts.push(completedPart);

          // Persist progress to IndexedDB after each chunk finishes
          await updateUploadedPart(fileId, completedPart);
        }
      };

      // 4. Run concurrent workers
      const workers = Array.from(
        { length: Math.min(CONCURRENCY, remainingPartNumbers.length || 1) },
        () => uploadWorker()
      );
      await Promise.all(workers);

      // 5. Finalize S3 Upload & clean up IndexedDB
      const res = await finalizeMultipartUpload({ key, uploadId, parts: completedParts });
      await clearUploadSession(fileId);

      setProgress(100);
      setCompletedUrl(res.publicUrl);
      setExistingSession(null);
    } catch (err: any) {
      if (err.message !== 'Paused') {
        alert(`Upload error: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePause = () => {
    abortControllerRef.current?.abort();
    setUploading(false);
  };

  const handleDiscard = async () => {
    if (!file) return;
    const fileId = generateFileId(file);
    const session = await getUploadSession(fileId);
    if (session) {
      await cancelMultipartUpload({ key: session.key, uploadId: session.uploadId });
      await clearUploadSession(fileId);
    }
    setExistingSession(null);
    setProgress(0);
  };

  return (
    <div className="max-w-md p-6 border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Resumable S3 Uploader</h2>

      <input
        type="file"
        disabled={uploading}
        onChange={handleFileChange}
        className="w-full border p-2 rounded"
      />

      {existingSession && !uploading && !completedUrl && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm space-y-2">
          <p className="text-blue-700">
            <strong>Resumable upload found:</strong> {existingSession.parts.length} chunks already uploaded.
          </p>
          <button
            onClick={handleDiscard}
            className="text-xs text-red-600 underline font-medium hover:text-red-800"
          >
            Discard and start over
          </button>
        </div>
      )}

      {(uploading || progress > 0) && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-600">{progress}% completed</p>
        </div>
      )}

      {completedUrl && (
        <p className="text-sm text-green-600 font-medium break-all">
          ✓ Finished: <a href={completedUrl} className="underline" target="_blank">{completedUrl}</a>
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleStartOrResumeUpload}
          disabled={!file || uploading}
          className="flex-1 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
        >
          {existingSession ? 'Resume Upload' : uploading ? 'Uploading...' : 'Start Upload'}
        </button>

        {uploading && (
          <button
            onClick={handlePause}
            className="px-4 py-2 border border-yellow-600 text-yellow-700 rounded font-medium"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
}

// Helper XHR function extracting S3 ETag header
function uploadChunk({
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
      reject(new Error('Paused'));
    };
    signal.addEventListener('abort', onAbort);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };

    xhr.onload = () => {
      signal.removeEventListener('abort', onAbort);
      if (xhr.status >= 200 && xhr.status < 300) {
        const rawETag = xhr.getResponseHeader('ETag');
        if (!rawETag) {
          reject(new Error('ETag header missing from S3 response. Verify CORS ExposeHeaders.'));
          return;
        }
        resolve(rawETag.replace(/['"]/g, ''));
      } else {
        reject(new Error(`Chunk upload failed with HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      reject(new Error('Network connection dropped'));
    };

    xhr.send(chunk);
  });
}

```

---

### Core Edge Cases Handled

* **Session Cleanup on Completion:** When `finalizeMultipartUpload` succeeds, `clearUploadSession(fileId)` cleans up IndexedDB so subsequent uploads of a file with identical metadata start fresh.
* **Transient Network Drops:** If a mobile or Wi-Fi drop interrupts an individual chunk, the browser can re-attempt the upload without losing earlier completed chunks.
* **Bucket S3 CORS Requirement:** The S3 bucket CORS policy must expose the `ETag` response header (`"ExposeHeaders": ["ETag"]`) for the client JavaScript to read and store the part hashes.
