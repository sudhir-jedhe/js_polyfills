Generating **BlurHash placeholders** and a responsive image pyramid (`small`, `medium`, `large` WebP variants) on the client eliminates heavy server-side image processing pipelines (e.g., Sharp Lambda layers).

The client:

1. Downsamples the source image into small $(32 \times 32)$ raw pixels to compute a 20–30 character **BlurHash string**.
2. Renders the image into responsive widths (e.g., $640\text{px}$, $1200\text{px}$, $1920\text{px}$) via `HTMLCanvasElement` or `OffscreenCanvas`.
3. Requests presigned S3 URLs for all variants in a single Server Action batch.
4. Uploads all variants concurrently to S3 and persists the metadata and BlurHash in the database.

---

### Step 1: Install BlurHash Encoder

Install the official client-side encoder:

```bash
npm install blurhash

```

---

### Step 2: Client Image Preprocessor & BlurHash Generator

This utility downscales images, encodes raw `ImageData` into a compact BlurHash string, and generates responsive WebP variants:

```typescript
// lib/client-image-processor.ts
import { encode } from 'blurhash';

export interface ResponsiveVariant {
  name: 'sm' | 'md' | 'lg';
  width: number;
  blob: Blob;
}

export interface ProcessedMediaPayload {
  blurhash: string;
  aspectRatio: number;
  originalWidth: number;
  originalHeight: number;
  variants: ResponsiveVariant[];
}

const RESPONSIVE_BREAKPOINTS: Array<{ name: 'sm' | 'md' | 'lg'; width: number }> = [
  { name: 'sm', width: 640 },
  { name: 'md', width: 1200 },
  { name: 'lg', width: 1920 },
];

export async function processImageAndGenerateBlurhash(
  file: File
): Promise<ProcessedMediaPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = async () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const aspectRatio = Number((originalWidth / originalHeight).toFixed(4));

        try {
          // 1. Generate BlurHash using a small 32x32 offscreen canvas
          const blurCanvas = document.createElement('canvas');
          const blurCtx = blurCanvas.getContext('2d');
          if (!blurCtx) throw new Error('2D context failed');

          const blurWidth = 32;
          const blurHeight = Math.max(1, Math.round(32 / aspectRatio));
          blurCanvas.width = blurWidth;
          blurCanvas.height = blurHeight;

          blurCtx.drawImage(img, 0, 0, blurWidth, blurHeight);
          const imageData = blurCtx.getImageData(0, 0, blurWidth, blurHeight);

          // Component resolution (4x3 is standard for photos)
          const blurhash = encode(
            imageData.data,
            imageData.width,
            imageData.height,
            4,
            3
          );

          // 2. Generate Responsive WebP Variants
          const variants: ResponsiveVariant[] = [];

          for (const bp of RESPONSIVE_BREAKPOINTS) {
            // Only generate variant if the original is larger than or close to the target width
            const targetWidth = Math.min(bp.width, originalWidth);
            const targetHeight = Math.round(targetWidth / aspectRatio);

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const blob = await new Promise<Blob>((res, rej) => {
              canvas.toBlob(
                (b) => (b ? res(b) : rej(new Error('Canvas toBlob conversion failed'))),
                'image/webp',
                0.8
              );
            });

            variants.push({
              name: bp.name,
              width: targetWidth,
              blob,
            });
          }

          resolve({
            blurhash,
            aspectRatio,
            originalWidth,
            originalHeight,
            variants,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image element'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

```

---

### Step 3: Batch Presigned URL Server Action

Batch-sign presigned S3 URLs for each responsive tier (`-sm.webp`, `-md.webp`, `-lg.webp`) and persist the BlurHash string:

```typescript
// app/actions/responsive-upload.ts
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

// 1. Batch generate presigned URLs for responsive variants
export async function getResponsiveUploadUrlsAction({
  fileName,
  variantNames,
}: {
  fileName: string;
  variantNames: string[];
}) {
  const assetId = crypto.randomUUID();
  const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  const safeBase = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');

  const signedTargets = await Promise.all(
    variantNames.map(async (variant) => {
      const key = `media/${assetId}/${safeBase}-${variant}.webp`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: 'image/webp',
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      return {
        variant,
        key,
        uploadUrl,
      };
    })
  );

  return { assetId, signedTargets };
}

// 2. Commit asset record with BlurHash and variant S3 paths
const SaveAssetSchema = z.object({
  title: z.string().min(1),
  blurhash: z.string().min(6),
  aspectRatio: z.number().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  variants: z.record(z.string()), // e.g. { sm: "media/...-sm.webp", md: "...", lg: "..." }
});

export async function saveResponsiveAssetAction(payload: z.infer<typeof SaveAssetSchema>) {
  const parsed = SaveAssetSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error('Invalid metadata payload');
  }

  const asset = await db.imageAsset.create({
    data: {
      title: parsed.data.title,
      blurhash: parsed.data.blurhash,
      aspectRatio: parsed.data.aspectRatio,
      width: parsed.data.width,
      height: parsed.data.height,
      variantPaths: parsed.data.variants,
      createdAt: new Date(),
    },
  });

  return { success: true, asset };
}

```

---

### Step 4: Client Upload Component with Live BlurHash Preview

```tsx
// app/components/ResponsiveImageUploader.tsx
'use client';

import { useState, useTransition } from 'react';
import {
  processImageAndGenerateBlurhash,
  type ProcessedMediaPayload,
} from '@/lib/client-image-processor';
import {
  getResponsiveUploadUrlsAction,
  saveResponsiveAssetAction,
} from '@/app/actions/responsive-upload';

export function ResponsiveImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [processed, setProcessed] = useState<ProcessedMediaPayload | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setStatus('processing');
    setErrorMessage(null);

    try {
      // 1. Process variants and BlurHash
      const result = await processImageAndGenerateBlurhash(selected);
      setProcessed(result);
      setStatus('idle');
    } catch (err: any) {
      setErrorMessage(err.message || 'Image processing failed');
      setStatus('error');
    }
  };

  const handleUpload = () => {
    if (!file || !processed || !title) return;

    setStatus('uploading');
    setErrorMessage(null);

    startTransition(async () => {
      try {
        // 2. Request presigned URLs for each variant tier
        const variantNames = processed.variants.map((v) => v.name);
        const { signedTargets } = await getResponsiveUploadUrlsAction({
          fileName: file.name,
          variantNames,
        });

        const targetMap = new Map(signedTargets.map((t) => [t.variant, t]));

        // 3. Parallel upload of all WebP tiers directly to S3
        await Promise.all(
          processed.variants.map(async (v) => {
            const target = targetMap.get(v.name);
            if (!target) throw new Error(`Missing upload URL for ${v.name}`);

            const res = await fetch(target.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'image/webp' },
              body: v.blob,
            });

            if (!res.ok) throw new Error(`Failed to upload ${v.name} variant`);
          })
        );

        // 4. Save metadata, BlurHash, and S3 keys
        const variantKeys: Record<string, string> = {};
        signedTargets.forEach((t) => {
          variantKeys[t.variant] = t.key;
        });

        await saveResponsiveAssetAction({
          title,
          blurhash: processed.blurhash,
          aspectRatio: processed.aspectRatio,
          width: processed.originalWidth,
          height: processed.originalHeight,
          variants: variantKeys,
        });

        setStatus('success');
      } catch (err: any) {
        setErrorMessage(err.message || 'Upload failed');
        setStatus('error');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Responsive Image & BlurHash Upload</h3>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hero banner image"
          className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Source Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={status === 'uploading'}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {status === 'processing' && (
        <p className="text-xs text-blue-600 animate-pulse font-medium">
          Generating BlurHash string and responsive breakpoints...
        </p>
      )}

      {/* Processed Metadata Summary */}
      {processed && (
        <div className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>Original Dimensions:</span>
            <strong>{processed.originalWidth} × {processed.originalHeight}px</strong>
          </div>

          <div>
            <span className="text-gray-500">BlurHash String:</span>
            <div className="font-mono text-[11px] bg-white p-1.5 border rounded break-all text-blue-900 mt-1">
              {processed.blurhash}
            </div>
          </div>

          <div className="pt-1">
            <span className="text-gray-500">Generated WebP Breakpoints:</span>
            <div className="flex gap-2 mt-1">
              {processed.variants.map((v) => (
                <span
                  key={v.name}
                  className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-[11px] font-semibold"
                >
                  {v.name.toUpperCase()} ({v.width}px - {(v.blob.size / 1024).toFixed(0)}KB)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <p className="text-xs text-blue-600 animate-pulse font-medium">
          Uploading responsive pyramid variants to S3 in parallel...
        </p>
      )}

      {status === 'success' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium">
          ✅ All responsive variants and BlurHash saved successfully!
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
        disabled={!file || !processed || !title || status === 'uploading' || isPending}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        {status === 'uploading' ? 'Uploading...' : 'Process & Upload All to S3'}
      </button>
    </div>
  );
}

```

---

### Step 5: Rendering the Responsive `<img>` with BlurHash

When rendering the saved image on your website, construct the standard responsive `srcset` and use `react-blurhash` or a lightweight canvas decode to display the placeholder before the WebP image loads:

```tsx
// app/components/ResponsiveImage.tsx
import { Blurhash } from 'react-blurhash';
import { useState } from 'react';

interface ResponsiveImageProps {
  blurhash: string;
  aspectRatio: number;
  alt: string;
  cdnBaseUrl: string;
  variants: {
    sm: string;
    md: string;
    lg: string;
  };
}

export function ResponsiveImage({
  blurhash,
  aspectRatio,
  alt,
  cdnBaseUrl,
  variants,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Construct responsive srcset string
  const srcSet = `
    ${cdnBaseUrl}/${variants.sm} 640w,
    ${cdnBaseUrl}/${variants.md} 1200w,
    ${cdnBaseUrl}/${variants.lg} 1920w
  `.trim();

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-gray-100"
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {/* BlurHash Placeholder (rendered under/over the image until load) */}
      {!isLoaded && (
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="absolute inset-0"
        />
      )}

      {/* Responsive Picture / Image */}
      <img
        src={`${cdnBaseUrl}/${variants.md}`}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
    </div>
  );
}

```

---

### Key Architectural Advantages

* **No Lambda Image Processing Costs:** The client's hardware encodes the BlurHash and downscales the WebP breakpoint files, eliminating Lambda compute costs and Sharp cold starts.
* **Instant Placeholder Delivery:** Storing the 20–30 character BlurHash string directly in the database row allows your SSR/Server Component to send zero-layout-shift placeholders inside initial HTML responses.
* **Saturated Network Uploads:** Uploading all responsive tiers in parallel via `Promise.all` directly to S3 via presigned URLs takes advantage of full client upload bandwidth.
