# Scenario: Lighthouse Flags a 900KB JS Bundle on a Mostly-Static Docs Page

Your documentation site's article page (`/docs/[slug]`) renders long-form technical content: headings, code blocks with syntax highlighting, a table of contents, and a "Copy code" button on each code block. Lighthouse reports a 900KB client JS bundle and a poor Time to Interactive score. Investigating, you find the entire `DocsArticle` component tree — including the syntax highlighter, the markdown-to-JSX renderer, and the table-of-contents generator — is marked `"use client"`, seemingly because the "Copy code" button needs an `onClick` handler.

**Approach:** Almost all of that 900KB is unnecessary client-side weight. The syntax highlighter, markdown parser, and TOC generator don't need any client-side interactivity at all — they take content in and produce static markup out. Only the "Copy code" button's click behavior genuinely requires the browser.

```tsx
// app/docs/[slug]/page.tsx — Server Component, does all the heavy lifting server-side
import { renderMarkdown } from '@/lib/markdown' // heavy, now server-only
import { generateToc } from '@/lib/toc'
import { CodeBlock } from './CodeBlock'

export default async function DocsArticle({ params }: { params: { slug: string } }) {
  const raw = await getDocContent(params.slug)
  const html = renderMarkdown(raw) // syntax highlighting happens here, server-side
  const toc = generateToc(raw)

  return (
    <div>
      <nav>{toc.map((t) => <a key={t.id} href={`#${t.id}`}>{t.title}</a>)}</nav>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
```

```tsx
// app/docs/[slug]/CodeBlock.tsx — the ONLY Client Component, tiny
'use client'
export function CopyButton({ code }: { code: string }) {
  return (
    <button onClick={() => navigator.clipboard.writeText(code)}>
      Copy
    </button>
  )
}
```

For code blocks specifically, the approach is to render the highlighted `<pre><code>` markup server-side (as part of the main HTML), and attach just a small `CopyButton` Client Component next to each block, passing the raw code string as a (serializable) prop — the syntax highlighting output itself never needs to be regenerated or touched client-side.

The bundle-size win here is substantial: the markdown parser and syntax highlighter are often hundreds of KB combined, and none of that code needs to exist in the browser once you remove the blanket `"use client"`. Post-fix, the client bundle for this page should shrink to roughly the size of `CopyButton` plus Next.js's baseline navigation runtime — likely under 10KB of page-specific JS instead of 900KB. The broader lesson to bring back to the team: `"use client"` should be justified component-by-component, not applied at the top of a page as a reflex whenever *any* part of it needs interactivity.
