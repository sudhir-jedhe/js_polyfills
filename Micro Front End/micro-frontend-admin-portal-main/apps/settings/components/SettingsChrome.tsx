import type { ReactNode } from "react";
import { AppLayout, type NavGroup } from "@portal/ui";
import { PORTAL_NAV, ROUTES } from "@portal/config";
import type { User } from "@portal/types";

/** Same shared chrome as the dashboard zone — identical sidebar => one app. */
export function SettingsChrome({
  user,
  active,
  title,
  children,
}: {
  user: User;
  active: string;
  title: string;
  children: ReactNode;
}) {
  const navGroups: NavGroup[] = PORTAL_NAV.map((section) => ({
    section: section.section,
    items: section.items.map((item) => ({
      ...item,
      active: item.href === active,
    })),
  }));

  return (
    <AppLayout
      brand="Admin Portal"
      title={title}
      user={user}
      navGroups={navGroups}
      logoutHref={ROUTES.logout}
    >
      {children}
    </AppLayout>
  );
}
