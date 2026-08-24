import { redirect } from "next/navigation";
import { Card, InfoMessage } from "@portal/ui";
import { ROUTES, absoluteUrl } from "@portal/config";
import { getSession } from "../../lib/session";
import { LoginForm } from "./LoginForm";

/** /auth/login — the sign-in screen. Already-authenticated users skip it. */
export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(absoluteUrl(ROUTES.dashboard));

  return (
    <div className="auth-wrap">
      <div className="auth-card stack">
        <div style={{ textAlign: "center" }}>
          <div className="sidebar__logo" style={{ margin: "0 auto 12px" }}>
            ◆
          </div>
          <h1 style={{ fontSize: 22 }}>Admin Portal</h1>
          <p className="muted">Sign in to your workspace</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <div className="row" style={{ justifyContent: "space-between" }}>
          {/* Plain <a>: single origin, ROUTES already carry the full path, so
              we avoid next/link's automatic basePath prefixing. */}
          <a className="muted" href={ROUTES.forgotPassword}>
            Forgot password?
          </a>
        </div>

        <InfoMessage>
          <strong>Demo only.</strong> Mock authentication — no real backend. Do
          not enter real credentials.
        </InfoMessage>
      </div>
    </div>
  );
}
