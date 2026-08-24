import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@portal/ui/styles.css";
import { requireUser } from "../lib/session";

export const metadata: Metadata = {
  title: "Dashboard · Admin Portal",
  description: "Dashboard zone for the Multi-Tenant Admin Portal.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Guard the whole zone here (above the route-level loading Suspense boundary)
  // so unauthenticated requests get a clean redirect BEFORE anything streams —
  // no loading flash, no partial render.
  await requireUser();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
