import { Card, Badge, EmptyState } from "@portal/ui";
import { ROUTES, getProjectsFor } from "@portal/config";
import { requireUser } from "../../lib/session";
import { DashboardChrome } from "../../components/DashboardChrome";

/** /dashboard/projects — a table of the user's projects. */
export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = getProjectsFor(user.id);

  return (
    <DashboardChrome user={user} active={ROUTES.projects} title="Projects">
      <div className="page-head">
        <h1>Projects</h1>
        <p>Projects owned by {user.name}.</p>
      </div>

      <Card>
        {projects.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No projects"
            hint="Create a project to get started."
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>
                    <Badge kind={p.status}>{p.status}</Badge>
                  </td>
                  <td>{p.progress}%</td>
                  <td className="muted">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardChrome>
  );
}
