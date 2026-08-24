import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@portal/ui/styles.css";

export const metadata: Metadata = {
  title: "Admin Portal",
  description:
    "Multi-Tenant Admin Portal — a micro-frontend architecture demo (Next.js Multi-Zones on Vercel).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
