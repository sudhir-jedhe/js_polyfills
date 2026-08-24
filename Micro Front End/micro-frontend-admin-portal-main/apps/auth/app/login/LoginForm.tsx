"use client";

import { useActionState, useState } from "react";
import { Button, Input, ErrorMessage } from "@portal/ui";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = { error: null };

/** Two demo identities, surfaced as one-click fills for easy user switching. */
const DEMO = [
  { label: "Alice (admin)", email: "alice@example.com", password: "password123" },
  { label: "Bob (user)", email: "bob@example.com", password: "password123" },
];

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="stack">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {state.error ? <ErrorMessage>{state.error}</ErrorMessage> : null}

      <Button type="submit" block disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <div className="stack" style={{ gap: 8, marginTop: 4 }}>
        <span className="muted" style={{ fontSize: 12 }}>
          Demo accounts — click to fill:
        </span>
        <div className="row">
          {DEMO.map((d) => (
            <Button
              key={d.email}
              type="button"
              variant="secondary"
              onClick={() => {
                setEmail(d.email);
                setPassword(d.password);
              }}
            >
              {d.label}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
}
