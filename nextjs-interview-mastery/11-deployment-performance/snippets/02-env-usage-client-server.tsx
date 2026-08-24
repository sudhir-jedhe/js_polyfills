// Server-only vs. NEXT_PUBLIC_ environment variable usage, side by side.

// .env.local
//   DATABASE_URL=postgres://user:pass@host/db          <- server-only
//   NEXT_PUBLIC_ANALYTICS_ID=UA-12345                    <- exposed to client

// app/api/orders/route.ts (Route Handler -- server-only code)
export async function GET() {
  // Safe: this file never ships to the browser.
  const db = connectToDatabase(process.env.DATABASE_URL!);
  const orders = await db.query('SELECT * FROM orders LIMIT 10');
  return Response.json(orders);
}

// components/analytics-script.tsx (Client Component)
// 'use client';

export function AnalyticsScript() {
  // process.env.NEXT_PUBLIC_ANALYTICS_ID is inlined into the client
  // bundle at build time -- visible in browser devtools, by design.
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.analyticsId = "${analyticsId}";`,
      }}
    />
  );
}

// DO NOT DO THIS -- referencing a server-only var from client code
// silently resolves to `undefined` at runtime, it does not throw:
// 'use client';
// export function Broken() {
//   return <div>{process.env.DATABASE_URL}</div>; // renders "undefined"
// }
