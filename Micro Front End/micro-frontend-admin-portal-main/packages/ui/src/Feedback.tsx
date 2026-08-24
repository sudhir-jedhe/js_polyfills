import type { ReactNode } from "react";

/** Inline loading indicator with spinner. */
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

/** Error banner. */
export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <div className="alert alert--error" role="alert">
      {children}
    </div>
  );
}

/** Info banner. */
export function InfoMessage({ children }: { children: ReactNode }) {
  return (
    <div className="alert alert--info" role="note">
      {children}
    </div>
  );
}

/** Empty-state placeholder for lists/tables with no rows. */
export function EmptyState({
  icon = "📭",
  title,
  hint,
}: {
  icon?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {hint ? <div style={{ marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}
