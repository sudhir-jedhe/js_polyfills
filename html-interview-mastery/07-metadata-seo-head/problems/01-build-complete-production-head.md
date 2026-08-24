# Problem: Build a Complete, Production-Ready `<head>` from a Content Brief

## Problem Statement

Given the following content brief, write the complete `<head>` markup for the page, applying every relevant technique from this topic.

**Brief:**
- Page: a blog post titled "5 Ways to Speed Up Your React App"
- URL: `https://example.com/blog/speed-up-react-app`
- Summary for search/social: "Practical, measurable techniques for cutting React render time — from memoization to code-splitting."
- Hero/share image: `https://example.com/og/react-speed.jpg`
- Site name: "Example Engineering Blog"
- Published: January 10, 2026
- Author: "Grace Hopper"
- This URL is the only place this content lives (no syndication, no parameter variants currently).
- Site already has a favicon at `/favicon.ico` and a manifest at `/site.webmanifest`.

## Constraints

- Must include charset and viewport tags, correctly ordered.
- Must include a unique `<title>` and meta description sized appropriately for SERP display.
- Must include full Open Graph tags plus a Twitter Card opt-in.
- Must include a canonical tag.
- Must NOT include a robots meta tag (this page should be indexed normally — omitting the tag entirely is equivalent to the default `index, follow`, and is the correct choice here, not an oversight).

## Solution

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>5 Ways to Speed Up Your React App | Example Engineering Blog</title>
  <meta name="description" content="Practical, measurable techniques for cutting React render time — from memoization to code-splitting.">

  <link rel="canonical" href="https://example.com/blog/speed-up-react-app">

  <meta property="og:type" content="article">
  <meta property="og:title" content="5 Ways to Speed Up Your React App">
  <meta property="og:description" content="Practical, measurable techniques for cutting React render time — from memoization to code-splitting.">
  <meta property="og:image" content="https://example.com/og/react-speed.jpg">
  <meta property="og:url" content="https://example.com/blog/speed-up-react-app">
  <meta property="og:site_name" content="Example Engineering Blog">
  <meta property="article:published_time" content="2026-01-10T00:00:00Z">
  <meta property="article:author" content="Grace Hopper">

  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
</head>
```

**Why no `<meta name="robots">` tag:** The default crawler behavior without this tag is already `index, follow` — since this page should be indexed normally with no exceptions, explicitly writing `<meta name="robots" content="index, follow">` would be redundant. Omitting it is the deliberate, correct choice for a normal public page, not a gap to fill in.

**Why the meta description is reused verbatim as `og:description`:** The brief provides one summary intended for both purposes, and there's no requirement here for a social-specific variant — reusing it avoids unnecessary duplication of near-identical copy that would need to be kept in sync. (In cases where a punchier, more social-native phrasing is desired, `og:description` can legitimately differ from the SEO meta description — but nothing in this brief calls for that.)

**Why `og:url` repeats the canonical URL exactly:** Both serve the same underlying purpose — declaring the one authoritative URL for this content — and keeping them consistent avoids sending conflicting signals to different platforms about which URL is "the real one."
