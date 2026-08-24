import { EmptyState } from "@portal/ui";
import { ROUTES } from "@portal/config";

/** Shown for unknown /settings/* paths. */
export default function SettingsNotFound() {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 420, textAlign: "center" }}>
        <EmptyState icon="🔍" title="Page not found" hint="This settings page doesn't exist." />
        <a className="btn btn--secondary" href={ROUTES.settings}>
          Back to settings
        </a>
      </div>
    </div>
  );
}
