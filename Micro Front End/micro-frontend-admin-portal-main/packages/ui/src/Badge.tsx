import type { Role } from "@portal/types";

type BadgeKind = "active" | "paused" | "archived" | Role;

/** Small status/role pill. `kind` maps to a color via CSS. */
export function Badge({ kind, children }: { kind: BadgeKind; children: React.ReactNode }) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}
