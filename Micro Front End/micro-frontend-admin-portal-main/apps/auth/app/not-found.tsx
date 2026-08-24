import { EmptyState } from "@portal/ui";
import { ROUTES } from "@portal/config";

/** Shown for unknown /auth/* paths. */
export default function AuthNotFound() {
  return (
    <div className="auth-wrap">
      <div className="auth-card stack" style={{ textAlign: "center" }}>
        <EmptyState icon="🔍" title="Page not found" hint="This page doesn't exist." />
        <a className="btn btn--secondary" href={ROUTES.login}>
          Back to sign in
        </a>
      </div>
    </div>
  );
}
