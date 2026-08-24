import { Card, Avatar, InfoMessage } from "@portal/ui";
import { ROUTES } from "@portal/config";
import { requireUser } from "../../lib/session";
import { SettingsChrome } from "../../components/SettingsChrome";

/** /settings/profile — the current user's profile details (read-only demo). */
export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <SettingsChrome user={user} active={ROUTES.profile} title="Profile">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Your personal information.</p>
      </div>

      <Card>
        <div className="row" style={{ gap: 16, marginBottom: 20 }}>
          <Avatar name={user.name} color={user.avatarColor} size={64} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
            <div className="muted">{user.email}</div>
          </div>
        </div>

        <div className="stack">
          <Field label="Full name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          <Field label="Tenant" value={user.tenantId} />
          <Field label="User ID" value={user.id} />
        </div>

        <div style={{ marginTop: 16 }}>
          <InfoMessage>
            <strong>Demo only.</strong> Editing is disabled — there is no backend
            to persist changes.
          </InfoMessage>
        </div>
      </Card>
    </SettingsChrome>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
      <span className="muted">{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}
