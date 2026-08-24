import { Card, StatCard } from "@portal/ui";
import { ROUTES, getStatsFor, getProjectsFor } from "@portal/config";
import { requireUser } from "../../lib/session";
import { DashboardChrome } from "../../components/DashboardChrome";

/** /dashboard/analytics — simple derived metrics from the user's mock data. */
export default async function AnalyticsPage() {
  const user = await requireUser();
  const stats = getStatsFor(user.id);
  const projects = getProjectsFor(user.id);

  const active = projects.filter((p) => p.status === "active").length;
  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((sum, p) => sum + p.progress, 0) / projects.length,
        );

  return (
    <DashboardChrome user={user} active={ROUTES.analytics} title="Analytics">
      <div className="page-head">
        <h1>Analytics</h1>
        <p>A quick read on {user.name}&apos;s workspace.</p>
      </div>

      <div className="grid grid--stats" style={{ marginBottom: 24 }}>
        <StatCard label="Active projects" value={active} hint="Currently in flight" />
        <StatCard label="Avg. progress" value={`${avgProgress}%`} hint="Across all projects" />
        <StatCard label="Open tasks" value={stats.openTasks} hint="Assigned to you" />
      </div>

      <Card title="Project progress" subtitle="Relative completion by project">
        <div className="stack">
          {projects.map((p) => (
            <div key={p.id} className="stack" style={{ gap: 4 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span className="muted">{p.progress}%</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--border)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${p.progress}%`,
                    height: "100%",
                    background: "var(--primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardChrome>
  );
}
