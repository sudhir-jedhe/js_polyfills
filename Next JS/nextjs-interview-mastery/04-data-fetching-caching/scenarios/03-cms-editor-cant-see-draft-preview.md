# Scenario: CMS Editors Can't Preview Unpublished Changes

Your marketing site's pages are ISR-cached with a 1-hour revalidate window, driven by a headless CMS. Content editors are frustrated: after saving a draft change in the CMS and clicking "Preview," they still see the old published content on the live preview URL, because the page is served from the 1-hour-stale cache. They need to see their in-progress edits reflected immediately, without waiting an hour or triggering a full site revalidation that would also expose unpublished drafts to real visitors.

**Approach:** This calls for a **separate, uncached preview path**, not a change to the main caching strategy (which is working as intended for real visitors). The standard pattern is a dedicated preview route (or a preview mode toggle) that bypasses the Data Cache entirely for that specific request, scoped to the editor's session rather than affecting the publicly cached version.

```tsx
// app/preview/[slug]/page.tsx — a separate route, always dynamic, never cached
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getDraftContent(slug: string, previewToken: string) {
  const res = await fetch(`https://cms.example.com/pages/${slug}?preview=true`, {
    headers: { Authorization: `Bearer ${previewToken}` },
    cache: 'no-store', // always fresh, even mid-edit
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const token = cookies().get('cms_preview_token')?.value
  if (!token) notFound()

  const content = await getDraftContent(params.slug, token)
  if (!content) notFound()

  return <PageRenderer content={content} isDraft />
}
```

The CMS's "Preview" button links editors to `/preview/[slug]` (protected by a preview token cookie set during CMS authentication) instead of the public `/[slug]` route. Because this route explicitly uses `cache: 'no-store'` and `force-dynamic`, every visit re-fetches the latest draft content directly from the CMS, completely independent of the public route's 1-hour ISR cache — editors always see their latest unsaved/draft changes, and the public site's caching strategy and performance for real visitors are entirely unaffected.

Worth clarifying to the content team: this preview route intentionally has no caching at all, since editors iterating on a draft need every keystroke-adjacent save to show up immediately, and preview traffic volume is low enough that the per-request cost of skipping the cache is a non-issue — a very different tradeoff than the public-facing pages, where caching is essential for handling real traffic volume efficiently.
