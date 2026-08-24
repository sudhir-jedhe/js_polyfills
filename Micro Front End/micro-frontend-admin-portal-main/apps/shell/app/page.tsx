import { redirect } from "next/navigation";
import { Card, InfoMessage } from "@portal/ui";
import { ROUTES } from "@portal/config";
import { getCurrentUser } from "../lib/session";

/**
 * / — the shell's landing page.
 *
 * If a valid session exists, send the user straight to the dashboard (standard
 * app behavior — no "click to continue" step). The landing below is only ever
 * shown to signed-out visitors.
 */
export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect(ROUTES.dashboard);

  return (
    <div className="auth-wrap">
      <div className="stack" style={{ maxWidth: 560, width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <div
            className="sidebar__logo"
            style={{ margin: "0 auto 14px", width: 44, height: 44, fontSize: 20 }}
          >
            ◆
          </div>
          <h1 style={{ fontSize: 28 }}>Multi-Tenant Admin Portal</h1>
          <p className="muted">
            Four independently deployed micro-frontends, stitched into one app
            with Next.js Multi-Zones.
          </p>
        </div>

        <Card>
          <p style={{ marginBottom: 16 }}>
            Sign in to access the dashboard and settings zones.
          </p>
          <a className="btn btn--primary btn--block" href={ROUTES.login}>
            Sign in
          </a>
        </Card>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <Zone name="Auth" path="/auth" desc="Login, logout, session" />
          <Zone name="Dashboard" path="/dashboard" desc="Stats, projects, analytics" />
          <Zone name="Settings" path="/settings" desc="Profile, security" />
        </div>

        <InfoMessage>
          <strong>Demo only.</strong> Mock authentication. Try{" "}
          <span className="mono">alice@example.com</span> /{" "}
          <span className="mono">bob@example.com</span> (password{" "}
          <span className="mono">password123</span>).
        </InfoMessage>
      </div>
    </div>
  );
}

function Zone({ name, path, desc }: { name: string; path: string; desc: string }) {
  return (
    <div className="card">
      <div className="card__title">{name}</div>
      <div className="mono muted" style={{ fontSize: 12, marginBottom: 6 }}>
        {path}
      </div>
      <div className="muted" style={{ fontSize: 13 }}>
        {desc}
      </div>
    </div>
  );
}
