"use client";

import { Button, ErrorMessage } from "@portal/ui";

/** Route-level error boundary for the shell (client component). */
export default function ShellError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 420 }}>
        <ErrorMessage>Something went wrong. Please try again.</ErrorMessage>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
