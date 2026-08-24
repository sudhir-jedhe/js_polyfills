import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@portal/ui/styles.css";

export const metadata: Metadata = {
  title: "Sign in · Admin Portal",
  description: "Authentication zone for the Multi-Tenant Admin Portal.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
