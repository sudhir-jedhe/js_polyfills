import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

/** Surface container. Presentational → safe as a server component. */
export function Card({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title ? <div className="card__title">{title}</div> : null}
      {subtitle ? <div className="card__subtitle">{subtitle}</div> : null}
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

/** A single dashboard metric tile. */
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="card stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      {hint ? <span className="stat__hint">{hint}</span> : null}
    </div>
  );
}
