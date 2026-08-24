"use client";

import { Button, ErrorMessage } from "@portal/ui";

/** Route-level error boundary for the settings zone (client component). */
export default function SettingsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 420 }}>
        <ErrorMessage>
          Something went wrong loading this page. Please try again.
        </ErrorMessage>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
