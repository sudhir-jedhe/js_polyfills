"use client";

import { Button, ErrorMessage } from "@portal/ui";

/**
 * Route-level error boundary. Must be a client component. We show a generic
 * message (never leak error internals to the user) and offer a retry.
 */
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
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
