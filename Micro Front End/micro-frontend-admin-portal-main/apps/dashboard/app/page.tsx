import { Card, StatCard, Badge, EmptyState } from "@portal/ui";
import { ROUTES, getStatsFor, getActivityFor } from "@portal/config";
import { requireUser } from "../lib/session";
import { DashboardChrome } from "../components/DashboardChrome";

/** /dashboard — overview: user-specific stat cards + recent activity. */
export default async function DashboardOverview() {
  const user = await requireUser();
  const stats = getStatsFor(user.id);
  const activity = getActivityFor(user.id);

  return (
    <DashboardChrome user={user} active={ROUTES.dashboard} title="Overview">
      <div className="page-head">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>
          Here&apos;s what&apos;s happening in the{" "}
          <span className="mono">{user.tenantId}</span> workspace.
        </p>
      </div>

      <div className="grid grid--stats" style={{ marginBottom: 24 }}>
        <StatCard label="Projects" value={stats.projects} hint="Total owned" />
        <StatCard label="Notifications" value={stats.notifications} hint="Unread" />
        <StatCard label="Open tasks" value={stats.openTasks} hint="Assigned to you" />
        <StatCard label="Team members" value={stats.teamMembers} hint="In workspace" />
      </div>

      <Card title="Recent activity" subtitle="Your latest actions across the workspace">
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" hint="Actions you take will show up here." />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((a) => (
                <tr key={a.id}>
                  <td>{a.action}</td>
                  <td className="mono">{a.target}</td>
                  <td className="muted">{new Date(a.at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {user.role === "admin" ? (
        <div style={{ marginTop: 16 }}>
          <Card title="Admin tools" subtitle="Visible to admins only">
            <div className="row">
              <Badge kind="admin">admin</Badge>
              <span className="muted">
                You can manage members and approve deployments.
              </span>
            </div>
          </Card>
        </div>
      ) : null}
    </DashboardChrome>
  );
}
