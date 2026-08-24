import { Card, InfoMessage } from "@portal/ui";
import { ROUTES } from "@portal/config";
import { requireUser, getSession } from "../../lib/session";
import { SettingsChrome } from "../../components/SettingsChrome";

/** /settings/security — session details + sign-out. */
export default async function SecurityPage() {
  const user = await requireUser();
  const session = await getSession();

  return (
    <SettingsChrome user={user} active={ROUTES.security} title="Security">
      <div className="page-head">
        <h1>Security</h1>
        <p>Your active session and sign-out.</p>
      </div>

      <Card title="Current session" subtitle="Read from the signed session cookie">
        {session ? (
          <div className="stack">
            <Row label="Signed in as" value={session.email} />
            <Row label="Role" value={session.role} />
            <Row label="Issued" value={new Date(session.issuedAt).toLocaleString()} />
            <Row label="Expires" value={new Date(session.expiresAt).toLocaleString()} />
          </div>
        ) : null}
      </Card>

      <div style={{ marginTop: 16 }}>
        <Card title="Session security" subtitle="How this session is protected">
          <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
            <li>Stored in an <strong>HttpOnly</strong> cookie (not readable by JS).</li>
            <li><strong>Secure</strong> + <strong>SameSite=Lax</strong> in production.</li>
            <li>HMAC-signed and <strong>server-validated</strong> by each zone.</li>
            <li>No password or session kept in localStorage or React state.</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <InfoMessage>
          <strong>Demo only.</strong> Mock authentication — not production-grade.
        </InfoMessage>
      </div>

      <div style={{ marginTop: 16 }}>
        <a className="btn btn--danger" href={ROUTES.logout}>
          Log out of this session
        </a>
      </div>
    </SettingsChrome>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
      <span className="muted">{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}
