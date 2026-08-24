interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

/** Circular initials avatar. Deterministic color passed in from user data. */
export function Avatar({ name, color = "#4f46e5", size = 34 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.42,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
