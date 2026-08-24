import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@portal/ui/styles.css";
import { requireUser } from "../lib/session";

export const metadata: Metadata = {
  title: "Settings · Admin Portal",
  description: "Settings zone for the Multi-Tenant Admin Portal.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Zone-level guard above the loading Suspense boundary — clean redirect for
  // unauthenticated requests before any streaming.
  await requireUser();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
