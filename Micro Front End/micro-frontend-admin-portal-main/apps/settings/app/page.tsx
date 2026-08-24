import { Card, Avatar, Badge } from "@portal/ui";
import { ROUTES } from "@portal/config";
import { requireUser } from "../lib/session";
import { SettingsChrome } from "../components/SettingsChrome";

/** /settings — account overview for the logged-in user. */
export default async function AccountPage() {
  const user = await requireUser();

  return (
    <SettingsChrome user={user} active={ROUTES.settings} title="Account">
      <div className="page-head">
        <h1>Account</h1>
        <p>Manage your profile and workspace access.</p>
      </div>

      <Card>
        <div className="row" style={{ gap: 16 }}>
          <Avatar name={user.name} color={user.avatarColor} size={56} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
            <div className="muted">{user.email}</div>
            <div style={{ marginTop: 6 }}>
              <Badge kind={user.role}>{user.role}</Badge>{" "}
              <span className="muted mono">tenant: {user.tenantId}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
        <a className="card" href={ROUTES.profile}>
          <div className="card__title">Profile →</div>
          <div className="muted">Name, email and avatar.</div>
        </a>
        <a className="card" href={ROUTES.security}>
          <div className="card__title">Security →</div>
          <div className="muted">Session and sign-out.</div>
        </a>
      </div>

      <div style={{ marginTop: 16 }}>
        <a className="btn btn--danger" href={ROUTES.logout}>
          Log out
        </a>
      </div>
    </SettingsChrome>
  );
}
