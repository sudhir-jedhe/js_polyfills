Integrating automated virus scanning on S3 file uploads relies on an **asynchronous quarantine and scan pipeline**.

Because virus scanning multi-megabyte/gigabyte files can take several seconds to minutes, running the scan synchronously inside a Next.js Server Action would cause server timeouts. Instead, the upload goes into an isolated **Quarantine Bucket**, an event-driven **AWS Lambda** (running ClamAV or AWS GuardDuty Malware Protection) scans the object, and Server Actions/Client UI poll or listen for status updates before promoting clean files to the **Clean Bucket**.

---

### End-to-End Architecture

```
[1. Client Browser]
      │
      ├── Requests Presigned PUT URL via Server Action
      └── Direct Upload to S3: `quarantine-bucket/uploads/temp-id/file.pdf`
              │
              ▼ (S3 Event Notification / EventBridge)
[2. AWS Lambda Scanner (ClamAV / GuardDuty)]
      ├── Downloads stream or scans object in memory
      │
      ├── CASE A: INFECTED / MALWARE DETECTED
      │     ├── Moves to `quarantine-bucket/infected/` (or deletes)
      │     ├── Emits SNS Alert / Updates DB: `status = 'INFECTED'`
      │     └── Sets S3 Object Tag: `scan-status=INFECTED`
      │
      └── CASE B: CLEAN / NO THREAT
            ├── Copies object to `clean-bucket/documents/`
            ├── Deletes object from `quarantine-bucket`
            ├── Updates DB: `status = 'CLEAN', s3Key = cleanKey`
            └── Sets S3 Object Tag: `scan-status=CLEAN`

```

---

### Step 1: AWS Lambda Scanner (ClamAV Docker / Container Image)

Deploy a Lambda function built on a container image containing the ClamAV binary and fresh virus definition databases (`main.cvd`, `daily.cvd` loaded from an EFS share or S3 mirror).

```typescript
// lambda/scanner.ts (Node.js running inside ClamAV Docker Container)
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand, PutObjectTaggingCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const execFileAsync = promisify(execFile);
const s3 = new S3Client({});

const CLEAN_BUCKET = process.env.CLEAN_BUCKET_NAME!;

export const handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const sourceBucket = record.s3.bucket.name;
    const sourceKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const tempFilePath = `/tmp/${Date.now()}-${sourceKey.split('/').pop()}`;

    try {
      // 1. Stream S3 object to ephemeral Lambda storage (/tmp)
      const getRes = await s3.send(new GetObjectCommand({ Bucket: sourceBucket, Key: sourceKey }));
      await pipeline(getRes.Body as Readable, createWriteStream(tempFilePath));

      // 2. Execute ClamAV scan (clamscan CLI or clamd socket)
      let isInfected = false;
      let scanOutput = '';

      try {
        const { stdout } = await execFileAsync('clamscan', ['--stdout', tempFilePath]);
        scanOutput = stdout;
      } catch (scanError: any) {
        // Exit code 1 means virus detected; code 2 means scan error
        if (scanError.code === 1) {
          isInfected = true;
          scanOutput = scanError.stdout;
        } else {
          throw scanError;
        }
      }

      if (isInfected) {
        console.warn(`[MALWARE DETECTED] Key: ${sourceKey}. Output: ${scanOutput}`);

        // Tag as infected and optionally notify security team
        await s3.send(new PutObjectTaggingCommand({
          Bucket: sourceBucket,
          Key: sourceKey,
          Tagging: { TagSet: [{ Key: 'scan-status', Value: 'INFECTED' }] },
        }));

        // Call your internal Webhook/API or write to DB
        await updateScanStatusInDb(sourceKey, 'INFECTED');
      } else {
        console.info(`[CLEAN] File: ${sourceKey}`);

        const cleanKey = sourceKey.replace('uploads/', 'verified/');

        // Move to permanent Clean Bucket
        await s3.send(new CopyObjectCommand({
          Bucket: CLEAN_BUCKET,
          CopySource: `${sourceBucket}/${encodeURIComponent(sourceKey)}`,
          Key: cleanKey,
          TaggingDirective: 'REPLACE',
          Tagging: 'scan-status=CLEAN',
        }));

        // Delete from Quarantine Bucket
        await s3.send(new DeleteObjectCommand({
          Bucket: sourceBucket,
          Key: sourceKey,
        }));

        // Update database record to 'CLEAN'
        await updateScanStatusInDb(sourceKey, 'CLEAN', cleanKey);
      }
    } catch (err) {
      console.error(`Error scanning object ${sourceKey}:`, err);
      await updateScanStatusInDb(sourceKey, 'ERROR');
    }
  }
};

async function updateScanStatusInDb(originalKey: string, status: 'CLEAN' | 'INFECTED' | 'ERROR', cleanKey?: string) {
  // Call internal DB directly or trigger backend API
  await fetch(`${process.env.APP_INTERNAL_URL}/api/internal/scan-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': process.env.INTERNAL_WEBHOOK_SECRET!,
    },
    body: JSON.stringify({ originalKey, status, cleanKey }),
  });
}

```

---

### Step 2: Server Actions for Upload & Status Polling

Define Server Actions in Next.js to provide upload presigned URLs pointing strictly to the **Quarantine Bucket** and to check the real-time scan status from your database:

```typescript
// app/actions/scan-upload.ts
'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const QUARANTINE_BUCKET = process.env.AWS_QUARANTINE_BUCKET_NAME!;

// 1. Get Presigned URL targeting Quarantine Bucket
export async function getQuarantineUploadUrlAction(fileName: string, fileType: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const fileId = crypto.randomUUID();
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `uploads/${fileId}-${cleanName}`;

  const command = new PutObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: fileKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  // Create pending database record
  const fileRecord = await db.scannedDocument.create({
    data: {
      id: fileId,
      userId: session.user.id,
      fileName,
      quarantineKey: fileKey,
      status: 'PENDING_SCAN',
    },
  });

  return { uploadUrl, fileId: fileRecord.id };
}

// 2. Poll Scan Status
export async function checkFileScanStatusAction(fileId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const document = await db.scannedDocument.findUnique({
    where: { id: fileId },
    select: { id: true, status: true, fileName: true, cleanKey: true },
  });

  if (!document) return { status: 'NOT_FOUND' };
  return document;
}

```

---

### Step 3: Webhook Endpoint for Lambda Scan Notifications

```typescript
// app/api/internal/scan-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret');
  if (secret !== process.env.INTERNAL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { originalKey, status, cleanKey } = await req.json();

  await db.scannedDocument.updateMany({
    where: { quarantineKey: originalKey },
    data: {
      status, // 'CLEAN' | 'INFECTED' | 'ERROR'
      cleanKey: cleanKey || null,
      scannedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}

```

---

### Step 4: Client Component with Real-Time Scanning Feedback

The client handles the direct upload, then polls `checkFileScanStatusAction` inside a `useTransition` loop until the Lambda confirms the file is clean:

```tsx
// app/components/ScanUploaderClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { getQuarantineUploadUrlAction, checkFileScanStatusAction } from '@/app/actions/scan-upload';

type StepStatus = 'IDLE' | 'UPLOADING' | 'SCANNING' | 'CLEAN' | 'INFECTED' | 'ERROR';

export function ScanUploaderClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<StepStatus>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleUploadAndScan = async () => {
    if (!file) return;

    setStatus('UPLOADING');
    setErrorMessage(null);

    try {
      // 1. Get Quarantine Presigned URL
      const { uploadUrl, fileId } = await getQuarantineUploadUrlAction(file.name, file.type);

      // 2. Direct upload to S3 Quarantine
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Upload to staging failed');

      // 3. Enter Scanning State & Poll for Lambda completion
      setStatus('SCANNING');
      pollScanResults(fileId);
    } catch (err: any) {
      setStatus('ERROR');
      setErrorMessage(err.message || 'Upload failed');
    }
  };

  const pollScanResults = (fileId: string) => {
    const interval = setInterval(async () => {
      startTransition(async () => {
        const result = await checkFileScanStatusAction(fileId);

        if (result.status === 'CLEAN') {
          clearInterval(interval);
          setStatus('CLEAN');
        } else if (result.status === 'INFECTED') {
          clearInterval(interval);
          setStatus('INFECTED');
          setErrorMessage('Malware detected. This file has been rejected and quarantined.');
        } else if (result.status === 'ERROR') {
          clearInterval(interval);
          setStatus('ERROR');
          setErrorMessage('Antivirus scanner encountered an error.');
        }
      });
    }, 2000); // Check every 2 seconds
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Secure Document Upload</h3>

      <input
        type="file"
        disabled={status === 'UPLOADING' || status === 'SCANNING'}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {/* Progress & Scanning Feedback */}
      {status === 'UPLOADING' && (
        <div className="text-xs text-blue-600 font-medium animate-pulse">
          Uploading to secure quarantine zone...
        </div>
      )}

      {status === 'SCANNING' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span>Running antivirus & malware inspection...</span>
        </div>
      )}

      {status === 'CLEAN' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium">
          ✅ File verified clean and moved to permanent storage!
        </div>
      )}

      {status === 'INFECTED' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {status === 'ERROR' && errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleUploadAndScan}
        disabled={!file || status === 'UPLOADING' || status === 'SCANNING'}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
      >
        {status === 'SCANNING' ? 'Scanning...' : 'Upload & Verify'}
      </button>
    </div>
  );
}

```

---

### Managed Alternative: AWS GuardDuty Malware Protection for S3

Instead of maintaining a custom ClamAV container and virus definitions database, you can enable **GuardDuty Malware Protection for S3**:

1. GuardDuty automatically scans objects uploaded to designated S3 buckets without maintaining Lambda code.
2. It tags scanned objects with `GuardDutyMalwareScanStatus: NO_THREATS_FOUND` or `THREATS_FOUND`.
3. An **EventBridge rule** listens for the `GuardDuty Malware Protection Object Scan Result` event and triggers a lightweight Lambda function that copies clean files to the permanent bucket or purges infected files.

---

### Key Security Safeguards

* **Quarantine Bucket Isolation:** Ensure the quarantine bucket has no public access, no CloudFront distributions attached, and IAM permissions that forbid direct user download access.
* **Auto-Delete Quarantine Files:** Add an S3 Lifecycle policy to automatically expire/delete objects in the quarantine bucket after 24–48 hours to prevent un-scanned or failed files from accumulating.
* **Stream-Based Scanning for Memory Efficiency:** For large files, use Node.js streams or mount an Amazon EFS volume to Lambda if file sizes exceed the `/tmp` storage allocation (configurable up to 10GB in AWS Lambda).
