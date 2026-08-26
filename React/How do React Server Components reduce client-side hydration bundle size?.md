How do React Server Components reduce client-side hydration bundle size?

React Server Components (RSC) reduce client-side hydration bundle size by fundamentally altering **what code gets sent to the browser**.

In traditional Server-Side Rendering (SSR), every component on the page must be shipped to the client as JavaScript so React can reconstruct the Virtual DOM and hydrate the page. In the RSC architecture, Server Components execute **exclusively on the server** and their JavaScript code is **completely excluded** from the client bundle.

---

### 1. Zero-Bundle-Size Server Components

When a component only fetches data, renders markup, or transforms props (and requires no interactivity like `useState`, `useEffect`, or event handlers), it remains a Server Component (the default in modern frameworks like Next.js App Router).

```tsx
// ServerComponent.tsx (No 'use client')
import marked from 'marked';         // 35 KB library
import sanitizeHtml from 'sanitize-html'; // 60 KB library
import db from '@/lib/db';

export async function Article({ articleId }: { articleId: string }) {
  const article = await db.article.findById(articleId);
  const html = sanitizeHtml(marked.parse(article.markdown));

  return (
    <div className="article">
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

```

* **Traditional SSR:** `Article.tsx`, `marked`, `sanitize-html`, and internal dependencies (~100 KB+ of JS) would all be included in the client JavaScript bundle to hydrate the page.
* **React Server Components:** **0 KB** of JavaScript is sent to the client for this component. The dependencies stay on the server; the client receives only the pre-computed HTML and lightweight Flight data stream.

---

### 2. Eliminating Hydration Work on the Client

Hydration is CPU-intensive: the browser must parse JavaScript, execute component functions, generate a virtual Fiber tree, and match each virtual node against real DOM nodes.

```
Traditional SSR:
[HTML sent to browser] ──▶ [Huge JS bundle downloaded] ──▶ [React hydrates EVERY DOM node]

React Server Components:
[HTML sent to browser] ──▶ [Tiny JS bundle (Client components only)] ──▶ [React hydrates ONLY Client components]
                                                                        └── Server Components are SKIPPED entirely

```

* React **never hydrates Server Component nodes**.
* Client-side React treats the output of Server Components as static structural slots, bypassing virtual DOM creation and event reconciliation for those subtrees.

---

### 3. Islands of Interactivity (`'use client'`)

JavaScript is only sent down for components explicitly marked with `'use client'`. This restricts the client bundle to interactive "leaf nodes" (like buttons, form inputs, modals, or animated widgets).

```tsx
// Page.tsx (Server Component - 0 KB client JS)
import { Sidebar } from './Sidebar';       // Server Component (0 KB)
import { Feed } from './Feed';             // Server Component (0 KB)
import { LikeButton } from './LikeButton'; // Client Component ('use client')

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="layout">
      <Sidebar />
      <Feed posts={posts}>
        {/* Only LikeButton's JS is bundled for the browser */}
        <LikeButton />
      </Feed>
    </div>
  );
}

```

---

### 4. Dependency Isolation

Server-heavy libraries that previously bloated frontend bundles no longer touch the browser:

| Dependency Type             | Example Libraries                    | Traditional SSR Bundle Impact | RSC Bundle Impact      |
| --------------------------- | ------------------------------------ | ----------------------------- | ---------------------- |
| **Markdown / Parsing**      | `marked`, `remark`, `prismjs`        | Heavy (~50–150 KB)            | **0 KB**               |
| **Date / Localization**     | `moment`, `date-fns` (large locales) | Heavy (~70 KB)                | **0 KB**               |
| **Data Fetching / DB**      | `prisma`, `pg`, `graphql-tag`        | Leaks or needs API layer      | **0 KB** (Server only) |
| **Sanitization / Security** | `dompurify`, `sanitize-html`         | Heavy (~40–80 KB)             | **0 KB**               |

---

### Summary of Performance Gains

* **Smaller JS Payload:** Client bundles contain only interactive code, drastically improving initial download and parse times (improving **First Contentful Paint** and **Largest Contentful Paint**).
* **Lower Main-Thread Execution Time:** By not executing component render logic for static subtrees, CPU usage drops, minimizing main-thread blocking (improving **Interaction to Next Paint / INP**).
* **No `__NEXT_DATA__` / `window.__INITIAL_DATA__` Bloat:** Instead of serializing massive raw JSON payloads for client re-rendering, RSC streams structured Flight format only for properties passed into active client boundaries.
