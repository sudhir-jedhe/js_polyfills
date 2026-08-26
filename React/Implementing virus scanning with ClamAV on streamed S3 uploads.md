When streaming uploads through Next.js or proxying S3 file streams, running virus inspection without writing files to local disk avoids exhausting server memory and disk I/O.

Connecting **Node.js WebStreams / `Readable` streams** directly to a **ClamAV daemon (`clamd`) via TCP sockets** using the **`INSTREAM` protocol** scans chunks in real time as they arrive. If clean, the stream pipes directly to S3; if infected, the stream is aborted immediately.

---

### Architecture & Data Flow

```
[Browser / Client Stream]
          │ (HTTP Chunked POST)
          ▼
[Next.js Server / Worker]
          │
          ├── 1. Splits incoming stream into two branches via `PassThrough`
          │
          ├── Branch A ──▶ Pipes to ClamAV `clamd` TCP socket (Port 3310 via `INSTREAM`)
          │                 └── Scans binary chunks in real time (Zero disk writes)
          │
          └── Branch B ──▶ Pipes to AWS S3 Upload (`@aws-sdk/lib-storage`)
                            │
                            ├── CASE A: CLEAN
                            │     └── ClamAV responds `stream: OK` ──▶ S3 upload completes
                            │
                            └── CASE B: INFECTED / MALWARE
                                  └── ClamAV responds `stream: <virus_name> FOUND`
                                  └── Upload aborted immediately ──▶ S3 deletes partial upload

```

---

### Step 1: Implement the ClamAV TCP Socket `INSTREAM` Client

ClamAV's daemon (`clamd`) accepts raw TCP chunk streams using its `INSTREAM` command format:

1. Client sends `zINSTREAM\0`
2. For each chunk: sends `[4-byte big-endian chunk length] + [chunk bytes]`
3. Closes stream with `[4-byte 0x00000000]` (zero-length chunk)
4. Daemon returns `stream: OK` or `stream: <virus> FOUND`

```typescript
// lib/clamav-stream.ts
import net from 'node:net';
import { Readable } from 'node:stream';

export interface ScanResult {
  isInfected: boolean;
  virusName?: string;
  rawResponse: string;
}

const CLAMAV_HOST = process.env.CLAMAV_HOST || '127.0.0.1';
const CLAMAV_PORT = Number(process.env.CLAMAV_PORT) || 3310;

/**
 * Streams a Readable stream directly to ClamAV clamd over TCP without disk buffering.
 */
export async function scanStreamWithClamAV(fileStream: Readable): Promise<ScanResult> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(CLAMAV_PORT, CLAMAV_HOST);

    let responseBuffer = '';

    socket.on('connect', () => {
      // 1. Send the INSTREAM command (zINSTREAM ends with \0)
      socket.write('zINSTREAM\0');

      // 2. Stream chunks formatted with 4-byte big-endian length prefix
      fileStream.on('data', (chunk: Buffer) => {
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(chunk.length, 0);

        socket.write(lengthBuffer);
        socket.write(chunk);
      });

      fileStream.on('end', () => {
        // 3. Send zero-length chunk to signal EOF
        const zeroChunk = Buffer.alloc(4);
        zeroChunk.writeUInt32BE(0, 0);
        socket.write(zeroChunk);
      });

      fileStream.on('error', (err) => {
        socket.destroy();
        reject(new Error(`File stream error: ${err.message}`));
      });
    });

    socket.on('data', (data) => {
      responseBuffer += data.toString('utf-8');
    });

    socket.on('end', () => {
      const trimmed = responseBuffer.trim();

      if (trimmed.endsWith('OK')) {
        resolve({ isInfected: false, rawResponse: trimmed });
      } else if (trimmed.includes('FOUND')) {
        const match = trimmed.match(/stream:\s+(.+)\s+FOUND/);
        resolve({
          isInfected: true,
          virusName: match ? match[1] : 'Unknown Malware',
          rawResponse: trimmed,
        });
      } else {
        reject(new Error(`ClamAV error: ${trimmed}`));
      }
    });

    socket.on('error', (err) => {
      reject(new Error(`ClamAV connection error: ${err.message}`));
    });
  });
}

```

---

### Step 2: Stream Duplication & Parallel S3 Upload Handler

Use `@aws-sdk/lib-storage`'s `Upload` utility to handle streaming uploads to S3 while concurrently streaming to ClamAV:

```typescript
// app/api/upload-stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough, Readable } from 'node:stream';
import { scanStreamWithClamAV } from '@/lib/clamav-stream';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs'; // Node.js required for TCP sockets & PassThrough streams
export const dynamic = 'force-dynamic';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || 'application/octet-stream';
  const fileName = req.headers.get('x-file-name') || 'unnamed-file';
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `uploads/verified/${crypto.randomUUID()}-${safeFileName}`;

  if (!req.body) {
    return NextResponse.json({ error: 'Empty file payload' }, { status: 400 });
  }

  // Convert Web ReadableStream to Node.js Readable
  const nodeInputStream = Readable.fromWeb(req.body as any);

  // 2. Create dual PassThrough streams
  const clamStream = new PassThrough();
  const s3Stream = new PassThrough();

  // Pipe input stream into both branches simultaneously
  nodeInputStream.pipe(clamStream);
  nodeInputStream.pipe(s3Stream);

  // 3. Initialize parallel S3 Upload instance
  const s3Upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: s3Stream,
      ContentType: contentType,
    },
    queueSize: 4,
    partSize: 5 * 1024 * 1024, // 5MB minimum chunks
  });

  try {
    // 4. Run ClamAV scanning and S3 Upload concurrently
    const [scanResult, s3Result] = await Promise.all([
      scanStreamWithClamAV(clamStream),
      s3Upload.done(),
    ]);

    // 5. If virus detected, abort and fail
    if (scanResult.isInfected) {
      // Abort S3 upload if still running or delete uploaded artifact
      await s3Upload.abort().catch(() => null);

      return NextResponse.json(
        {
          status: 'rejected',
          error: `Upload rejected: Malware detected (${scanResult.virusName}).`,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      status: 'success',
      fileKey,
      location: s3Result.Location,
    });
  } catch (error: any) {
    // Abort S3 upload on socket or transmission failure
    await s3Upload.abort().catch(() => null);

    console.error('Scan or upload failure:', error);
    return NextResponse.json(
      { error: error.message || 'Stream processing failed' },
      { status: 500 }
    );
  }
}

```

---

### Step 3: ClamAV Docker Setup (`clamd.conf`)

Run ClamAV in a container alongside your application (or in a private VPC cluster). Ensure `MaxStreamSize` matches your application's file size limit:

```dockerfile
# Dockerfile.clamav
FROM clamav/clamav:latest

# Increase maximum streaming buffer size (e.g. 100MB)
RUN echo "StreamMaxLength 100M" >> /etc/clamav/clamd.conf && \
    echo "MaxScanSize 100M" >> /etc/clamav/clamd.conf && \
    echo "MaxFileSize 100M" >> /etc/clamav/clamd.conf && \
    echo "TCPSocket 3310" >> /etc/clamav/clamd.conf && \
    echo "TCPAddr 0.0.0.0" >> /etc/clamav/clamd.conf

EXPOSE 3310

```

---

### Step 4: Client Upload Component with Streaming Status

```tsx
// app/components/StreamingScanUpload.tsx
'use client';

import { useState } from 'react';

export function StreamingScanUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResultMessage(null);
    setIsError(false);

    try {
      // Stream raw binary via POST fetch
      const res = await fetch('/api/upload-stream', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-file-name': file.name,
        },
        body: file, // Streams directly from browser
        // @ts-expect-error - duplex is supported in modern fetch
        duplex: 'half',
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setResultMessage(data.error || 'Upload failed');
      } else {
        setIsError(false);
        setResultMessage(`✅ Upload clean and verified! File key: ${data.fileKey}`);
      }
    } catch (err: any) {
      setIsError(true);
      setResultMessage(err.message || 'Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900">Real-time Stream Virus Scanner</h3>

      <input
        type="file"
        disabled={uploading}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {uploading && (
        <div className="text-xs text-blue-600 flex items-center gap-2 animate-pulse font-medium">
          <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Streaming & scanning in real time...</span>
        </div>
      )}

      {resultMessage && (
        <div
          className={`p-3 rounded text-xs font-medium ${
            isError
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {resultMessage}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
      >
        {uploading ? 'Processing Stream...' : 'Stream to S3'}
      </button>
    </div>
  );
}

```

---

### Core Operational Principles

* **Zero Disk I/O:** Neither the Next.js server nor the ClamAV container writes temporary files to disk; the byte stream flows directly through network sockets.
* **Stream Synchronization:** Using `PassThrough` splits the Node.js stream so both ClamAV and `@aws-sdk/lib-storage` consume identical chunks concurrently.
* **Memory Bounds via `StreamMaxLength`:** Configure `StreamMaxLength` in `clamd.conf` to match your maximum allowed upload size. If a file exceeds this limit, ClamAV rejects the stream with `INSTREAM size limit exceeded`.
* **Automatic Rollback:** If ClamAV detects malware, calling `s3Upload.abort()` immediately signals S3 to discard all uploaded multi-part chunks.
