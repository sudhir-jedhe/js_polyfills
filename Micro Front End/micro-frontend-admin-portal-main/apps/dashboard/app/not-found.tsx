import { EmptyState } from "@portal/ui";
import { ROUTES } from "@portal/config";

/** Shown for unknown /dashboard/* paths. */
export default function DashboardNotFound() {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 420, textAlign: "center" }}>
        <EmptyState icon="🔍" title="Page not found" hint="This dashboard page doesn't exist." />
        <a className="btn btn--secondary" href={ROUTES.dashboard}>
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
