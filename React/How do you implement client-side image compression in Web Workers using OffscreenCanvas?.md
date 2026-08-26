Running image compression on the main UI thread with standard `<canvas>` can cause dropped frames, unresponsiveness, and jank—especially when processing large camera photos (12MP–48MP) or batches of files.

Offloading the compression to a **Web Worker** using **`createImageBitmap()`** and **`OffscreenCanvas`** runs the entire decoding, downscaling, and WebP encoding process on a background thread without touching the DOM or main thread.

---

### Step 1: Implement the Worker Script

Web Workers do not have access to the DOM or `new Image()`, but modern browser environments support `createImageBitmap()` and `OffscreenCanvas`:

```typescript
// workers/image-compressor.worker.ts

export interface CompressionWorkerInput {
  id: string;
  file: File;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

export interface CompressionWorkerOutput {
  id: string;
  success: boolean;
  compressedBlob?: Blob;
  compressedName?: string;
  originalSize?: number;
  compressedSize?: number;
  error?: string;
}

self.onmessage = async (e: MessageEvent<CompressionWorkerInput>) => {
  const {
    id,
    file,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    mimeType = 'image/webp',
  } = e.data;

  try {
    // 1. Decode image into an ImageBitmap off the main thread
    const imageBitmap = await createImageBitmap(file);

    let { width, height } = imageBitmap;

    // 2. Calculate aspect-ratio constrained dimensions
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

    // 3. Render onto OffscreenCanvas
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not acquire 2D context on OffscreenCanvas');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // Free ImageBitmap memory immediately
    imageBitmap.close();

    // 4. Convert to compressed Blob
    const compressedBlob = await offscreenCanvas.convertToBlob({
      type: mimeType,
      quality,
    });

    const extension = mimeType === 'image/webp' ? '.webp' : '.jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const compressedName = `${baseName}${extension}`;

    const response: CompressionWorkerOutput = {
      id,
      success: true,
      compressedBlob,
      compressedName,
      originalSize: file.size,
      compressedSize: compressedBlob.size,
    };

    self.postMessage(response);
  } catch (err: any) {
    const errorResponse: CompressionWorkerOutput = {
      id,
      success: false,
      error: err.message || 'Worker failed to compress image',
    };
    self.postMessage(errorResponse);
  }
};

```

---

### Step 2: Client Worker Pool & Compression Hook

Create a wrapper service that instantiates the worker and returns a standard `Promise<File>`:

```typescript
// lib/worker-compressor.ts
import type { CompressionWorkerInput, CompressionWorkerOutput } from '@/workers/image-compressor.worker';

let workerInstance: Worker | null = null;
const pendingJobs = new Map<
  string,
  { resolve: (file: File) => void; reject: (reason: any) => void; originalFile: File }
>();

function getWorker(): Worker {
  if (!workerInstance && typeof window !== 'undefined') {
    // Next.js / Webpack / Vite worker instantiation syntax
    workerInstance = new Worker(
      new URL('../workers/image-compressor.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerInstance.onmessage = (e: MessageEvent<CompressionWorkerOutput>) => {
      const { id, success, compressedBlob, compressedName, error } = e.data;
      const job = pendingJobs.get(id);

      if (!job) return;
      pendingJobs.delete(id);

      if (success && compressedBlob && compressedName) {
        const file = new File([compressedBlob], compressedName, {
          type: compressedBlob.type,
          lastModified: Date.now(),
        });
        job.resolve(file);
      } else {
        job.reject(new Error(error || 'Failed to compress in worker'));
      }
    };
  }

  return workerInstance!;
}

export async function compressInWorker(
  file: File,
  options: Partial<Omit<CompressionWorkerInput, 'id' | 'file'>> = {}
): Promise<File> {
  // Pass through SVGs or non-image assets
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // Fallback for older browsers without OffscreenCanvas support
  if (typeof OffscreenCanvas === 'undefined') {
    console.warn('OffscreenCanvas unsupported, falling back to original file.');
    return file;
  }

  const worker = getWorker();
  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    pendingJobs.set(id, { resolve, reject, originalFile: file });

    const payload: CompressionWorkerInput = {
      id,
      file,
      maxWidth: options.maxWidth ?? 1920,
      maxHeight: options.maxHeight ?? 1080,
      quality: options.quality ?? 0.8,
      mimeType: options.mimeType ?? 'image/webp',
    };

    worker.postMessage(payload);
  });
}

```

---

### Step 3: Integrating with Multi-File React Upload Form

```tsx
// app/components/WorkerBatchUploadForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { compressInWorker } from '@/lib/worker-compressor';

interface ProcessedFileItem {
  id: string;
  originalName: string;
  originalSize: number;
  compressedFile?: File;
  status: 'compressing' | 'ready' | 'error';
  error?: string;
}

export function WorkerBatchUploadForm() {
  const [items, setItems] = useState<ProcessedFileItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 1. Initialize queue with pending state
    const newItems: ProcessedFileItem[] = files.map((f) => ({
      id: crypto.randomUUID(),
      originalName: f.name,
      originalSize: f.size,
      status: 'compressing',
    }));

    setItems((prev) => [...prev, ...newItems]);

    // 2. Compress files concurrently inside the background worker
    files.forEach(async (file, index) => {
      const targetId = newItems[index].id;

      try {
        const compressed = await compressInWorker(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.75,
          mimeType: 'image/webp',
        });

        setItems((prev) =>
          prev.map((item) =>
            item.id === targetId
              ? { ...item, status: 'ready', compressedFile: compressed }
              : item
          )
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === targetId
              ? { ...item, status: 'error', error: err.message }
              : item
          )
        );
      }
    });

    e.target.value = '';
  };

  const handleSubmit = () => {
    const readyFiles = items
      .map((item) => item.compressedFile)
      .filter((f): f is File => Boolean(f));

    if (readyFiles.length === 0) return;

    startTransition(async () => {
      const formData = new FormData();
      readyFiles.forEach((f) => formData.append('images', f));

      // Submit compressed files to Server Action / Presigned URL upload
      // await uploadBatchAction(formData);
    });
  };

  const isCompressing = items.some((i) => i.status === 'compressing');

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Background Worker Compression</h3>
      <p className="text-xs text-gray-500">
        High-res images are downsampled and converted to WebP on a separate thread without blocking animations or typing.
      </p>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelection}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {/* Processed File List */}
      {items.length > 0 && (
        <ul className="divide-y border rounded-lg overflow-hidden max-h-56 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="p-3 bg-gray-50 text-xs flex justify-between items-center">
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-gray-800 truncate">{item.originalName}</p>
                <p className="text-[11px] text-gray-500 font-mono">
                  {(item.originalSize / 1024).toFixed(0)} KB
                  {item.compressedFile && (
                    <span className="text-emerald-600 font-semibold ml-1">
                      → {(item.compressedFile.size / 1024).toFixed(0)} KB
                    </span>
                  )}
                </p>
              </div>

              <div>
                {item.status === 'compressing' && (
                  <span className="text-blue-600 font-medium animate-pulse">Compressing...</span>
                )}
                {item.status === 'ready' && (
                  <span className="text-emerald-700 font-medium">✓ Ready</span>
                )}
                {item.status === 'error' && (
                  <span className="text-red-600 font-medium">⚠ {item.error}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        disabled={items.length === 0 || isCompressing || isPending}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        {isPending ? 'Uploading to Server...' : 'Submit Compressed Files'}
      </button>
    </div>
  );
}

```

---

### Core Performance Principles

* **Explicit Memory Deallocation (`imageBitmap.close()`):** Always call `.close()` on `ImageBitmap` instances inside the worker immediately after painting to the canvas to avoid memory accumulation during batch uploads.
* **Worker Singleton Reuse:** Avoid spawning a new `new Worker()` per image. Keeping a single shared worker instance processing jobs via message IDs amortizes thread creation costs.
* **Fallback Strategy:** If `typeof OffscreenCanvas === 'undefined'` (legacy Safari versions or constrained WebViews), fall back gracefully to the uncompressed original or the standard DOM canvas.
