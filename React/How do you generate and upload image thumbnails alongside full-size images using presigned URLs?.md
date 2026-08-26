Generating thumbnails directly in the client and uploading both the full-size image and thumbnail to S3/R2 via presigned URLs removes the need for expensive, memory-heavy serverless image-processing pipelines (like Sharp in AWS Lambda).

---

### Architecture & Data Flow

```
[Browser Client]
       │
       ├── 1. Generates thumbnail via HTML Canvas (e.g. 300x300 WebP)
       │
       ├── 2. Calls Server Action: `getDualPresignedUrlsAction({ fileName, fileType })`
       │      └── Returns presigned PUT URLs for both `images/original/*` and `images/thumbnails/*`
       │
       ├── 3. Uploads original and thumbnail in parallel to S3 using `Promise.all([fetch, fetch])`
       │
       └── 4. Calls Server Action to link `{ originalKey, thumbnailKey }` into the database

```

---

### Step 1: Canvas Thumbnail Generation Utility

Use the HTML Canvas API to downscale the image into a standardized thumbnail and output a `Blob`:

```typescript
// lib/thumbnail-generator.ts

export interface ThumbnailResult {
  thumbnailBlob: Blob;
  thumbnailFileName: string;
  width: number;
  height: number;
}

export async function generateClientThumbnail(
  file: File,
  maxDimension = 300,
  quality = 0.8
): Promise<ThumbnailResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Compute constrained dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context creation failed'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob conversion failed'));
              return;
            }

            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const thumbnailFileName = `${baseName}-thumb.webp`;

            resolve({
              thumbnailBlob: blob,
              thumbnailFileName,
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

```

---

### Step 2: Server Actions for Presigned URLs & Finalization

```typescript
// app/actions/dual-image-upload.ts
'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import db from '@/lib/db';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

const DualPresignSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().startsWith('image/'),
});

// 1. Generate Presigned PUT URLs for both full-size image and thumbnail
export async function getDualPresignedUrlsAction(fileName: string, fileType: string) {
  const parsed = DualPresignSchema.safeParse({ fileName, fileType });
  if (!parsed.success) {
    throw new Error('Invalid file parameters');
  }

  const fileId = crypto.randomUUID();
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const baseName = safeName.substring(0, safeName.lastIndexOf('.')) || safeName;

  const originalKey = `images/original/${fileId}-${safeName}`;
  const thumbnailKey = `images/thumbnails/${fileId}-${baseName}-thumb.webp`;

  // Original Upload URL
  const originalCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: originalKey,
    ContentType: fileType,
  });

  // Thumbnail Upload URL (always image/webp)
  const thumbnailCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: thumbnailKey,
    ContentType: 'image/webp',
  });

  const [originalUploadUrl, thumbnailUploadUrl] = await Promise.all([
    getSignedUrl(s3, originalCommand, { expiresIn: 300 }),
    getSignedUrl(s3, thumbnailCommand, { expiresIn: 300 }),
  ]);

  return {
    originalUploadUrl,
    thumbnailUploadUrl,
    originalKey,
    thumbnailKey,
  };
}

// 2. Persist media references to database
export async function saveMediaRecordAction({
  title,
  originalKey,
  thumbnailKey,
  fileSize,
}: {
  title: string;
  originalKey: string;
  thumbnailKey: string;
  fileSize: number;
}) {
  const record = await db.media.create({
    data: {
      title,
      originalKey,
      thumbnailKey,
      fileSize,
      createdAt: new Date(),
    },
  });

  return { success: true, record };
}

```

---

### Step 3: Client Dual-Upload Component

```tsx
// app/components/DualImageUploader.tsx
'use client';

import { useState, useTransition } from 'react';
import { generateClientThumbnail } from '@/lib/thumbnail-generator';
import {
  getDualPresignedUrlsAction,
  saveMediaRecordAction,
} from '@/app/actions/dual-image-upload';

export function DualImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage(null);
    setUploadStatus('processing');

    try {
      // Generate instant preview thumbnail
      const { thumbnailBlob } = await generateClientThumbnail(selected, 300, 0.8);
      setThumbPreview(URL.createObjectURL(thumbnailBlob));
      setUploadStatus('idle');
    } catch (err: any) {
      setErrorMessage('Failed to generate thumbnail preview');
      setUploadStatus('error');
    }
  };

  const handleUpload = () => {
    if (!file || !title) return;

    setUploadStatus('uploading');
    setErrorMessage(null);

    startTransition(async () => {
      try {
        // 1. Generate client-side thumbnail blob
        const { thumbnailBlob } = await generateClientThumbnail(file, 300, 0.8);

        // 2. Request presigned URLs for both files
        const { originalUploadUrl, thumbnailUploadUrl, originalKey, thumbnailKey } =
          await getDualPresignedUrlsAction(file.name, file.type);

        // 3. Upload both original and thumbnail in parallel directly to S3
        await Promise.all([
          fetch(originalUploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          }).then((res) => {
            if (!res.ok) throw new Error('Failed uploading full-size image');
          }),
          fetch(thumbnailUploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/webp' },
            body: thumbnailBlob,
          }).then((res) => {
            if (!res.ok) throw new Error('Failed uploading thumbnail');
          }),
        ]);

        // 4. Save metadata to database
        await saveMediaRecordAction({
          title,
          originalKey,
          thumbnailKey,
          fileSize: file.size,
        });

        setUploadStatus('success');
      } catch (err: any) {
        setErrorMessage(err.message || 'Upload failed');
        setUploadStatus('error');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="text-base font-bold text-gray-900">Upload Image with Thumbnail</h3>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hero banner"
          className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Image File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploadStatus === 'uploading'}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {/* Thumbnail Preview */}
      {thumbPreview && (
        <div className="p-3 bg-gray-50 border rounded-lg flex items-center gap-3">
          <img
            src={thumbPreview}
            alt="Thumbnail preview"
            className="w-16 h-16 object-cover rounded-md border"
          />
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-gray-800">Generated Thumbnail</p>
            <p className="text-[11px] text-gray-500">Format: WebP (300px max)</p>
          </div>
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <p className="text-xs text-blue-600 font-medium animate-pulse">
          Uploading original and thumbnail in parallel...
        </p>
      )}

      {uploadStatus === 'success' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium">
          ✅ Image and thumbnail uploaded and linked successfully!
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || !title || uploadStatus === 'uploading' || isPending}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Both to S3'}
      </button>
    </div>
  );
}

```

---

### Core Principles

* **Atomic Parallel Uploads:** `Promise.all([uploadOriginal, uploadThumbnail])` saturates client bandwidth and cuts total upload time roughly in half compared to sequential requests.
* **Deterministic Thumbnail Encoding:** Standardizing thumbnails on `'image/webp'` guarantees modern compression savings and simplifies storage keys regardless of whether the source image was PNG, JPEG, or HEIC.
* **Zero Server Compute:** Generating the thumbnail client-side and using presigned URLs ensures your Next.js server handles zero image decoding, resizing, or memory buffering.
