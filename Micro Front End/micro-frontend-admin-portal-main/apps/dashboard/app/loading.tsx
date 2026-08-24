import { Loading } from "@portal/ui";

/** Shown while a dashboard route's server component resolves. */
export default function DashboardLoading() {
  return (
    <div className="auth-wrap">
      <Loading label="Loading dashboard…" />
    </div>
  );
}
