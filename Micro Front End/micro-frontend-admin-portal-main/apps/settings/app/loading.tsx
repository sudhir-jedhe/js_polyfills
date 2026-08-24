import { Loading } from "@portal/ui";

/** Shown while a settings route's server component resolves. */
export default function SettingsLoading() {
  return (
    <div className="auth-wrap">
      <Loading label="Loading settings…" />
    </div>
  );
}
