import { Loading } from "@portal/ui";

/** Shown while an auth route resolves. */
export default function AuthLoading() {
  return (
    <div className="auth-wrap">
      <Loading label="Loading…" />
    </div>
  );
}
