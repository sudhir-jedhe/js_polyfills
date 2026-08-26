When you need to stream private S3 files while guaranteeing **compliance audit logging** (e.g., logging exact bytes served, tracking completed downloads, or preventing direct S3 URL sharing), use a **Next.js Route Handler** with **Node.js/Web `ReadableStream` piping**.

This ensures every request passes through authentication, records access logs in your database, and streams the binary data chunk-by-chunk without loading the entire file into server RAM.

---

### Architecture & Data Flow

```
[Browser Client: GET /api/documents/[id]/download]
       │
       ▼
[Next.js App Router Route Handler (Node.js Runtime)]
       ├── 1. Authenticate user & verify ACL/Tenant permissions
       ├── 2. Fetch S3 Object stream (`GetObjectCommand`)
       ├── 3. Transform S3 SDK stream to a Web `ReadableStream`
       ├── 4. Intercept stream completion / cancellation to record audit metrics (bytes served)
       ├── 5. Insert audit log row into DB (`audit_logs`)
       └── 6. Return `new Response(stream, { headers })`

```

---

### Step 1: Implement the Streaming Route Handler with Audit Logging

Create a dynamic Route Handler (`app/api/documents/[id]/download/route.ts`). Configure the runtime as `nodejs` because streaming large binaries with the AWS SDK relies on Node.js stream utilities.

```typescript
// app/api/documents/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: documentId } = await params;

  // 1. Authenticate user session
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch document metadata and check authorization
  const document = await db.document.findUnique({
    where: { id: documentId },
    select: { id: true, userId: true, s3Key: true, fileName: true, mimeType: true, fileSize: true },
  });

  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (document.userId !== session.user.id && session.user.role !== 'AUDITOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 3. Request object stream from S3
    const s3Response = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: document.s3Key,
      })
    );

    if (!s3Response.Body) {
      return NextResponse.json({ error: 'File content is empty' }, { status: 404 });
    }

    const nodeStream = s3Response.Body as Readable;

    // 4. Wrap the stream in a Web TransformStream to monitor audit progress & byte count
    let bytesStreamed = 0;
    const startTime = Date.now();
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';

    const auditTransformStream = new TransformStream({
      transform(chunk: Uint8Array, controller) {
        bytesStreamed += chunk.length;
        controller.enqueue(chunk);
      },
      async flush() {
        // Stream completed successfully - write audit log to database
        const durationMs = Date.now() - startTime;
        await db.auditLog.create({
          data: {
            documentId: document.id,
            userId: session.user.id,
            action: 'DOCUMENT_DOWNLOAD_COMPLETED',
            bytesTransferred: bytesStreamed,
            durationMs,
            ipAddress: clientIp,
            userAgent: request.headers.get('user-agent') || 'unknown',
            createdAt: new Date(),
          },
        });
      },
    });

    // Convert Node.js Readable stream to Web ReadableStream and pipe through the audit transformer
    const webStream = Readable.toWeb(nodeStream).pipeThrough(auditTransformStream);

    // 5. Construct secure streaming response headers
    const safeFileName = encodeURIComponent(document.fileName);
    const headers = new Headers();
    headers.set('Content-Type', document.mimeType || 'application/octet-stream');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`
    );
    if (s3Response.ContentLength) {
      headers.set('Content-Length', s3Response.ContentLength.toString());
    }
    // Prevent caching intermediate proxies from retaining private documents
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new Response(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Streaming error from S3:', error);

    // Log the failed download attempt
    await db.auditLog.create({
      data: {
        documentId: document.id,
        userId: session.user.id,
        action: 'DOCUMENT_DOWNLOAD_FAILED',
        errorDetails: error.message,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ error: 'Failed to stream document' }, { status: 500 });
  }
}

```

---

### Step 2: Database Audit Schema

Track security events, data volumes, and identity markers for auditing:

```prisma
// prisma/schema.prisma
model Document {
  id        String     @id @default(uuid())
  userId    String
  fileName  String
  s3Key     String
  mimeType  String
  fileSize  Int
  createdAt DateTime   @default(now())
  auditLogs AuditLog[]
}

model AuditLog {
  id               String   @id @default(uuid())
  documentId       String
  userId           String
  action           String   // 'DOCUMENT_DOWNLOAD_COMPLETED', 'DOCUMENT_DOWNLOAD_FAILED'
  bytesTransferred Int?     @default(0)
  durationMs       Int?     @default(0)
  ipAddress        String
  userAgent        String?
  errorDetails     String?
  createdAt        DateTime @default(now())

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

```

---

### Step 3: Client Trigger Component

Trigger downloads natively through the streaming endpoint without page unmounts:

```tsx
// app/components/AuditDownloadButton.tsx
'use client';

import { useState } from 'react';

interface AuditDownloadButtonProps {
  documentId: string;
  fileName: string;
}

export function AuditDownloadButton({ documentId, fileName }: AuditDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      // Stream the response directly into a client blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded shadow-sm disabled:opacity-50 transition flex items-center gap-2"
    >
      {downloading ? (
        <>
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Streaming file...</span>
        </>
      ) : (
        <span>Download (Audited)</span>
      )}
    </button>
  );
}

```

---

### Comparison: Presigned GET vs. Server-Side Streaming

| Metric / Requirement         | Presigned GET URLs                                            | Server-Side Streaming with Audit Logs                               |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Server Resource Overhead** | **Zero** (Client $\leftrightarrow$ S3 direct)                 | **Low to Moderate** (Proxies stream through Node.js)                |
| **Audit Log Accuracy**       | Approximate (Only tracks URL generation, not actual download) | **Exact** (Logs actual bytes transferred and completion status)     |
| **Direct S3 URL Exposure**   | Yes (Temporary signed S3 hostname is visible in network tab)  | **No** (S3 bucket and infrastructure remain hidden behind your API) |
| **Revocation / IP Lockdown** | Difficult after token issuance                                | **Instant** (Checked in real-time on every single request)          |

---

### Key Operational Guarantees

* **Memory Safety via `Readable.toWeb()`:** Using `Readable.toWeb(nodeStream)` avoids buffering files into Node.js buffer memory, allowing files of several gigabytes to stream within modest server memory limits.
* **Strict Anti-Caching Headers:** Setting `Cache-Control: private, no-store, no-cache` ensures intermediary proxies or CDNs never store and re-serve the binary without hitting your authentication checks.
* **Handling Aborted Downloads:** If the user closes their browser mid-download, `flush()` won't fire. You can add a `cancel()` callback to `TransformStream` to log partial transfers (`action: 'DOCUMENT_DOWNLOAD_ABORTED'`).
