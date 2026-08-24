// app/api/stats/route.js
// Explicit route segment config: force dynamic evaluation and pick a runtime.

export const dynamic = 'force-dynamic'; // never cache this GET response
export const runtime = 'nodejs';        // 'nodejs' (default) or 'edge'

export async function GET() {
  const stats = await getLiveStats(); // always fresh, per-request work

  return Response.json(stats, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function getLiveStats() {
  return { activeUsers: Math.floor(Math.random() * 1000), timestamp: Date.now() };
}
