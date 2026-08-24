import { Card, InfoMessage } from "@portal/ui";
import { ROUTES } from "@portal/config";

/** /auth/forgot-password — static informational page (no real reset flow). */
export default function ForgotPasswordPage() {
  return (
    <div className="auth-wrap">
      <div className="auth-card stack">
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 20 }}>Reset your password</h1>
          <p className="muted">We&apos;ll email you a reset link.</p>
        </div>
        <Card>
          <InfoMessage>
            <strong>Demo only.</strong> There is no backend, so password reset is
            not implemented. Use the demo accounts on the sign-in page.
          </InfoMessage>
          <div style={{ marginTop: 14 }}>
            <a className="btn btn--secondary btn--block" href={ROUTES.login}>
              Back to sign in
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
