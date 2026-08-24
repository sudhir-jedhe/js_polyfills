import { EmptyState } from "@portal/ui";
import { ROUTES } from "@portal/config";

/** Shown for unknown top-level paths on the shell. */
export default function ShellNotFound() {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 420, textAlign: "center" }}>
        <EmptyState icon="🔍" title="Page not found" hint="This page doesn't exist." />
        <a className="btn btn--secondary" href={ROUTES.home}>
          Back home
        </a>
      </div>
    </div>
  );
}
