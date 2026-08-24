# Metadata, SEO & `<head>`

Everything in `<head>` is invisible on the rendered page yet quietly controls how browsers render it, how search engines index it, and how it looks when shared on social platforms — making it one of those topics where a candidate can build a beautiful page and still fail an interview question about it, because they've never had to think about the tags nobody sees. This topic covers the essential `<head>` tags, social preview metadata, classic SEO fundamentals, and the crawling/indexing controls that are frequently confused with each other (`robots.txt` vs. the robots meta tag being the single most common mix-up).

## Folder structure

- **`theory/`** — `<head>` essentials (charset, viewport), Open Graph/Twitter Cards, `<title>`/meta description for SEO, canonical URLs, robots meta tag vs. `robots.txt`, and structured data (JSON-LD) plus a light touch on favicon/manifest/font preloading.
- **`snippets/`** — 7 small, copy-pasteable metadata blocks covering each concept.
- **`output-based/`** — 7 "what happens?" questions, including the classic `robots.txt`-blocks-`noindex` trap.
- **`scenarios/`** — 5 real-world situations: fixing a broken social share preview, recovering from duplicate-content SEO issues, deindexing a page correctly, adding rich results via structured data, and auditing a neglected `<head>`.
- **`interview-qa/`** — Q&A grouped into themed files: `<head>` fundamentals & SEO basics, and crawling/indexing/structured data.
- **`problems/`** — 4 hands-on challenges: build a complete, production-ready `<head>` from a content brief, generate Open Graph tags programmatically, fix a duplicate-content canonical setup, and write JSON-LD for a product page.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `<meta charset>` and `<meta name="viewport">` — why they must come first/early, and what breaks without them
- Open Graph and Twitter Card meta tags for social share previews
- `<title>` and meta description best practices for search click-through rate
- Canonical URLs (`rel="canonical"`) and how they prevent duplicate-content SEO problems
- The robots meta tag vs. `robots.txt` — the crawling-vs-indexing distinction and the trap of blocking a page you're trying to `noindex`
- Structured data (JSON-LD/schema.org) for rich search results
- A light touch on favicon, web app manifest, and preloading fonts referenced in `<head>`
