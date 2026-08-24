"use client";

import { useState, type ReactNode } from "react";
import type { User } from "@portal/types";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: string;
}

export interface NavGroup {
  /** Optional section heading (e.g. "Dashboard", "Settings"). */
  section?: string;
  items: NavItem[];
}

interface AppLayoutProps {
  brand: string;
  title: string;
  user: Pick<User, "name" | "role" | "avatarColor">;
  navGroups: NavGroup[];
  logoutHref: string;
  children: ReactNode;
}

/**
 * The shared application chrome (sidebar + topbar) that makes four separate
 * micro-frontends look and feel like ONE app.
 *
 * Purely presentational: nav links (including cross-app absolute URLs) and the
 * current user are passed in as props. It deliberately imports NOTHING from
 * @portal/config so no server-only code (node:crypto) or mock credentials leak
 * into the client bundle.
 */
export function AppLayout({
  brand,
  title,
  user,
  navGroups,
  logoutHref,
  children,
}: AppLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      {open ? (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      ) : null}

      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo">◆</span>
          {brand}
        </div>

        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.section ? (
              <div className="sidebar__section">{group.section}</div>
            ) : null}
            <nav className="sidebar__nav">
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`sidebar__link ${item.active ? "sidebar__link--active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon ? <span aria-hidden>{item.icon}</span> : null}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ))}

        <div className="sidebar__spacer" />
        <div className="sidebar__foot">
          <a className="sidebar__link" href={logoutHref}>
            <span aria-hidden>⎋</span> Log out
          </a>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="row">
            <button
              className="topbar__menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <span className="topbar__title">{title}</span>
          </div>
          <div className="topbar__right">
            <div className="topbar__user">
              <Avatar name={user.name} color={user.avatarColor} />
              <div>
                <div className="topbar__user-name">{user.name}</div>
                <div className="topbar__user-role">
                  <Badge kind={user.role}>{user.role}</Badge>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
