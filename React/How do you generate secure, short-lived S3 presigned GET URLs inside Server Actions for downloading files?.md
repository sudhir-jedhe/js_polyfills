Generating secure, short-lived presigned `GET` URLs inside Server Actions allows users to download private files directly from S3 without proxying heavy binary data through your server.

This pattern requires three core controls:

1. **Server-Side Authorization Check:** Verify that the requesting user owns or has permission to access the document before signing the URL.
2. **Short Time-to-Live (TTL):** Set expiration windows between 60 to 300 seconds ($1\text{--}5\text{ minutes}$).
3. **Response Headers Override:** Set `ResponseContentDisposition` to enforce file downloads (attachment) and preserve clean, human-readable file names.

---

### Step 1: Implement the Presigned Download Server Action

Use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to create the signed `GetObjectCommand`:

```typescript
// app/actions/documents.ts
'use server';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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

export type DownloadResult =
  | { success: true; downloadUrl: string; fileName: string }
  | { success: false; error: string };

/**
 * Validates user permissions and generates a short-lived S3 download URL.
 */
export async function getDocumentDownloadUrlAction(documentId: string): Promise<DownloadResult> {
  // 1. Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  // 2. Fetch record and verify authorization/ownership
  const document = await db.document.findUnique({
    where: { id: documentId },
    select: { id: true, userId: true, s3Key: true, fileName: true },
  });

  if (!document) {
    return { success: false, error: 'Document not found.' };
  }

  if (document.userId !== session.user.id) {
    return { success: false, error: 'Access denied: You do not own this document.' };
  }

  try {
    // 3. Configure GetObjectCommand with content-disposition override
    // Forces browser download prompt with the original filename
    const safeFileName = encodeURIComponent(document.fileName);
    
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: document.s3Key,
      ResponseContentDisposition: `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`,
    });

    // 4. Generate URL expiring in 120 seconds (2 minutes)
    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return {
      success: true,
      downloadUrl,
      fileName: document.fileName,
    };
  } catch (error: any) {
    console.error('Failed to generate presigned GET URL:', error);
    return { success: false, error: 'Unable to prepare download link.' };
  }
}

```

---

### Step 2: Client Download Button Component

Invoke the Server Action inside a React transition, and dynamically trigger the download in the browser without leaving the page:

```tsx
// app/components/DownloadDocumentButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { getDocumentDownloadUrlAction } from '@/app/actions/documents';

interface DownloadButtonProps {
  documentId: string;
  label?: string;
}

export function DownloadDocumentButton({
  documentId,
  label = 'Download',
}: DownloadButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = () => {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await getDocumentDownloadUrlAction(documentId);

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      // Create an invisible anchor tag to trigger native browser download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleDownload}
        disabled={isPending}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition disabled:opacity-50 flex items-center gap-1.5"
      >
        {isPending ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating link...</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </button>

      {errorMessage && (
        <span className="text-[11px] text-red-600 font-medium">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

```

---

### Inline View (Browser Preview) vs. File Download

To preview the file directly in the browser (e.g., viewing a PDF or image in a new tab) instead of forcing a download prompt, change `ResponseContentDisposition` from `attachment` to `inline`:

```typescript
// Inside GetObjectCommand:
const viewCommand = new GetObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET_NAME!,
  Key: document.s3Key,
  ResponseContentDisposition: `inline; filename="${safeFileName}"`,
  ResponseContentType: 'application/pdf', // Explicit MIME override
});

```

---

### Security Best Practices Checklist

* **Zero Direct Bucket Access:** Keep S3 bucket settings strictly private with **Block All Public Access** enabled. All client access should resolve through temporary presigned tokens.
* **Tight Expiration Window (60–120s):** For programmatic downloads triggered immediately via JavaScript, keep the TTL between 60 to 120 seconds. Longer expirations increase the window for link-sharing or token leakage.
* **Strict Multi-Tenant Checks:** Always query the document record by `(id, userId)` or check permissions before creating the command. Never sign URLs based solely on a client-provided S3 key path.
* **Sanitize Filenames:** Sanitize `fileName` strings and encode them inside `ResponseContentDisposition` to prevent header injection attacks.
