Compressing images on the client before submitting them via `FormData` reduces bandwidth usage, prevents server payload limit errors (e.g., Next.js 1MB/4MB body limits), and accelerates upload speeds.

The standard client-side implementation uses the native **HTML Canvas API** (or `OffscreenCanvas` / Web Workers) to resize dimensions, re-encode as WebP/JPEG, and convert the result into a lightweight `Blob`/`File` object before appending it to `FormData`.

---

### Step 1: Canvas Compression Utility

This utility reads the file, calculates proportional dimensions up to a maximum width/height, draws it to a canvas, and compresses it to modern WebP (with JPEG fallback):

```typescript
// lib/image-compressor.ts

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/webp' | 'image/jpeg';
}

/**
 * Resizes and compresses an image file in the browser before network transmission.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    mimeType = 'image/webp',
  } = options;

  // Skip non-compressible files (e.g. SVGs or PDFs)
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio-constrained dimensions
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width / maxWidth > height / maxHeight) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create canvas 2D context'));
          return;
        }

        // Optional: Improve downsampling smoothness
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }

            // Derive target filename with correct extension
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const extension = mimeType === 'image/webp' ? '.webp' : '.jpg';
            const compressedFileName = `${originalName}${extension}`;

            const compressedFile = new File([blob], compressedFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image into DOM'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

```

---

### Step 2: Server Action Receiver

The Server Action receives the compressed file inside `FormData`. The payload is significantly smaller (often reduced by $70\%\text{--}90\%$):

```typescript
// app/actions/upload-avatar.ts
'use server';

import { z } from 'zod';

const AvatarSchema = z.object({
  username: z.string().min(2),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, 'File must be under 2MB')
    .refine(
      (file) => ['image/webp', 'image/jpeg', 'image/png'].includes(file.type),
      'Only WebP, JPEG, or PNG formats are supported'
    ),
});

export type UploadState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  avatarUrl?: string;
};

export async function uploadAvatarAction(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const file = formData.get('avatar') as File;
  const username = formData.get('username') as string;

  const parsed = AvatarSchema.safeParse({ username, avatar: file });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message || 'Validation failed',
    };
  }

  try {
    // Binary is ready for S3 / Cloudflare R2 / Database storage
    console.log(`Received file: ${file.name}, size: ${(file.size / 1024).toFixed(1)} KB`);

    return {
      status: 'success',
      message: `Successfully uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)!`,
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message || 'Failed to process file on server',
    };
  }
}

```

---

### Step 3: Client Form with Instant Compression Preview

Intercept form submission to compress the image file in-memory before passing the modified `FormData` to `useActionState`:

```tsx
// app/components/CompressedImageUploadForm.tsx
'use client';

import { useState, useActionState, startTransition } from 'react';
import { uploadAvatarAction, type UploadState } from '@/app/actions/upload-avatar';
import { compressImage } from '@/lib/image-compressor';

const initialState: UploadState = {
  status: 'idle',
};

export function CompressedImageUploadForm() {
  const [state, formAction, isPending] = useActionState(uploadAvatarAction, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // 1. Compress immediately upon file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsCompressing(true);

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.75,
        mimeType: 'image/webp',
      });

      setCompressedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // 2. Submit intercepted FormData with compressed File
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Swap the raw input file with the compressed File object
    if (compressedFile) {
      formData.set('avatar', compressedFile);
    }

    startTransition(async () => {
      await formAction(formData);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4"
    >
      <h3 className="font-bold text-gray-900 text-lg">Client-Compressed Upload</h3>

      {state.message && (
        <div
          className={`p-3 rounded text-xs font-medium ${
            state.status === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
          Username
        </label>
        <input
          name="username"
          placeholder="janedoe"
          required
          className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {isCompressing && (
        <p className="text-xs text-blue-600 animate-pulse font-medium">
          Compressing image in browser...
        </p>
      )}

      {/* Comparison Metrics */}
      {selectedFile && compressedFile && !isCompressing && (
        <div className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2">
          <div className="flex justify-between items-center text-gray-600">
            <span>Original: <strong>{(selectedFile.size / 1024).toFixed(1)} KB</strong></span>
            <span>Compressed: <strong className="text-emerald-600">{(compressedFile.size / 1024).toFixed(1)} KB</strong></span>
          </div>

          <div className="text-[11px] text-gray-500">
            Savings: <strong>{(100 - (compressedFile.size / selectedFile.size) * 100).toFixed(0)}% reduction</strong>
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border mt-2"
            />
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isCompressing || !compressedFile}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        {isPending ? 'Uploading to Server...' : 'Submit Profile'}
      </button>
    </form>
  );
}

```

---

### Core Performance & Quality Best Practices

* **Format Selection (WebP):** `image/webp` delivers approximately $25\%\text{--}35\%$ better compression than JPEG at equivalent visual quality across modern browsers.
* **Canvas Memory Cleanup:** Free object preview URLs when components unmount using `URL.revokeObjectURL(previewUrl)` to avoid browser memory leaks.
* **OffscreenCanvas in Web Workers (Large Batches):** When compressing multiple images simultaneously, execute canvas operations inside a Web Worker using `OffscreenCanvas` to prevent blocking the browser's main UI thread.
* **Server-Side Validation Guardrail:** Never rely solely on client-side compression for security. Always validate MIME magic bytes and maximum file sizes on the server.
