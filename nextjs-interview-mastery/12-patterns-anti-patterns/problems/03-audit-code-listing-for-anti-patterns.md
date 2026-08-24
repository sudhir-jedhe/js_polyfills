# Problem 3: Audit an App Router project and list every anti-pattern found

## Task

Review the following small project (a "saved articles" reading-list feature) and produce a written audit: list every anti-pattern present, why it's a problem, and the fix — following the same format as the worked example in `scenarios/03-audit-project-anti-patterns.md`.

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/reading-list/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function ReadingListPage() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    fetch('/api/reading-list').then((r) => r.json()).then(setArticles);
  }, []);

  if (!articles) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reading List</h1>
      {articles.map((a) => (
        <div key={a.id}>
          <img src={a.thumbnailUrl} />
          <a href={`/articles/${a.id}`}>{a.title}</a>
        </div>
      ))}
    </div>
  );
}

// middleware.ts
export async function middleware(request) {
  const userAgent = request.headers.get('user-agent');
  await db.analytics.logPageView({ path: request.nextUrl.pathname, userAgent });
  return NextResponse.next();
}
```

## Requirements

1. Identify at least **five** distinct anti-patterns across the three files (there are more than five present — find as many as you reasonably can).
2. For each: name it, explain the concrete negative consequence (not just "this is bad practice"), and provide a corrected code snippet.
3. Prioritize the list — call out which one or two issues you'd fix first if there were limited time before a launch, and justify the ordering.

## Self-check

- Does your audit cover: `'use client'` scope, `useEffect` data fetching, raw `<img>` usage, raw `<a>` for internal navigation, middleware doing blocking DB work, missing `matcher` scoping, and missing loading/error boundaries?
- Is each fix accompanied by working corrected code, not just a description?
- Is the prioritization justified by actual impact (e.g., "the middleware issue affects every request site-wide, so it's fixed first") rather than arbitrary ordering?
