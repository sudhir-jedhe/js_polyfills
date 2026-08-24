// app/api/geo-redirect/route.ts
// Edge Runtime: fast cold start, runs close to the user, but limited
// to Web-standard APIs -- no Node-native modules.

export const runtime = 'edge';

export async function GET(request: Request) {
  // Web-standard APIs work fine on Edge: fetch, Request, Response,
  // Headers, URL, Web Crypto.
  const country = request.headers.get('x-vercel-ip-country') ?? 'US';

  const redirectMap: Record<string, string> = {
    GB: '/uk',
    DE: '/de',
    FR: '/fr',
  };

  const target = redirectMap[country];
  if (target) {
    return Response.redirect(new URL(target, request.url));
  }

  return Response.json({ country, redirected: false });
}

// This would FAIL on the Edge Runtime -- no Node-native `fs` module:
//
// import fs from 'fs';
// export async function GET() {
//   const data = fs.readFileSync('./config.json', 'utf-8'); // throws
//   return Response.json(JSON.parse(data));
// }
