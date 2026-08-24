"use client";

import { Button, ErrorMessage } from "@portal/ui";

/** Route-level error boundary for the auth zone (client component). */
export default function AuthError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card stack">
        <ErrorMessage>Something went wrong. Please try again.</ErrorMessage>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
