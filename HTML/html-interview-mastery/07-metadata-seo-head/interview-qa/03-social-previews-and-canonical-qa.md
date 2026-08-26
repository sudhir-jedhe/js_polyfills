*** copy 03-social-previews-and-canonical-qa.md ***

# Interview Q&A — Social Previews & Canonical URLs

**Q: Why do Open Graph tags use `property="og:..."` while Twitter Card tags use `name="twitter:..."`?**
Open Graph is built on the RDFa vocabulary convention, which uses `property`; Twitter Cards use the standard HTML `name` attribute for metadata. It's a small but real syntax difference — writing `name="og:title"` instead of `property="og:title"` is technically invalid per the Open Graph spec, even though many scrapers tolerate it.

**Q: Why must `og:image` be an absolute URL rather than relative?**
Social platform scrapers fetch and parse `<meta>` tags largely out of full page/browser context — some don't reliably resolve a relative path the way a browser resolves a relative `<img src>` against the current page URL, so a relative `og:image` risks a broken or missing preview image.

**Q: If a page has Open Graph tags but no Twitter-specific tags, does Twitter/X still show a preview?**
Usually yes — X/Twitter generally falls back to the equivalent Open Graph tags (`og:title`, `og:description`, `og:image`) when the `twitter:*` versions are absent. Adding just `twitter:card` (e.g., `summary_large_image`) is often enough to control layout without duplicating every field.

**Q: Why should even a page with no known duplicates still have a self-referencing canonical tag?**
It's cheap, standard insurance against future duplication (tracking parameters added later, a syndication partner mirroring the content, `www`/non-`www` variants) and removes any ambiguity for crawlers up front, rather than waiting for a duplication problem to actually occur before fixing it.

**Q: Can a canonical tag point to a URL on a completely different domain?**
Yes — commonly used for syndicated content, where the syndicating site's canonical points back to the original source's URL, signaling that the original (not the syndicated copy) should be the one that ranks.

**Q: What data does `og:type="article"` unlock that `og:type="website"` doesn't?**
It enables `article:*` extension tags — `article:published_time`, `article:author`, `article:section`, etc. — which some platforms use to enrich the preview or display metadata (author, publish date) alongside the standard title/description/image.

**Q: What real-world detail commonly causes a "fixed" social preview to still look broken to the person who fixed it?**
Many platforms cache a previously-scraped preview for a given URL — after correcting the meta tags, the old cached preview can persist until the platform is prompted to re-scrape (often via a dedicated debug/preview tool for that platform), which is easy to mistake for the fix not having worked.
