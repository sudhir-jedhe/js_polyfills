// app/api/search/route.js
// GET /api/search?q=next&page=2&pageSize=10
// Reading and validating query params via request.nextUrl.searchParams.

export async function GET(request) {
  const { searchParams } = request.nextUrl;

  const q = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const pageSize = Math.min(50, Number(searchParams.get('pageSize') ?? 10));

  if (q.length === 0) {
    return Response.json({ error: 'q is required' }, { status: 400 });
  }

  // ...fetch/filter results using q, page, pageSize
  return Response.json({ query: q, page, pageSize, results: [] });
}
