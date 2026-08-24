# Problem: Fix a Broken Canonical Setup Causing Duplicate Content

## Problem Statement

A product page is reachable at four different URLs, all serving identical content. Given the current (broken) canonical tags on each, identify what's wrong with each one and write the corrected version.

**Current state:**

```html
<!-- https://example.com/products/watch -->
<link rel="canonical" href="https://example.com/products/watch">

<!-- https://www.example.com/products/watch -->
<link rel="canonical" href="https://www.example.com/products/watch">

<!-- https://example.com/products/watch?utm_source=email -->
<link rel="canonical" href="https://example.com/products/watch?utm_source=email">

<!-- https://example.com/products/watch/ (trailing slash) -->
<!-- no canonical tag present at all -->
```

## Constraints

- Pick exactly one URL as the single canonical target for all four variants — justify the choice.
- Every variant, including the one chosen as canonical, must declare a canonical tag pointing at that same target.
- The fix must be expressed as what each of the four pages' `<head>` should contain.

## Approach

The core bug is that each variant currently declares itself as its own canonical (or has none at all) instead of all four pointing at one shared target — this is functionally the same as having no canonical tags at all, since a self-referencing canonical on a duplicate doesn't consolidate anything. Pick the "cleanest" URL (no `www`, no tracking parameters, no trailing slash — matching how the URL would ideally be presented/linked) as the single target, and point every variant, including that one itself, at it.

## Solution

Chosen canonical target: `https://example.com/products/watch` (non-`www`, no query parameters, no trailing slash — the simplest, most link-worthy form).

```html
<!-- https://example.com/products/watch  (the canonical target itself) -->
<link rel="canonical" href="https://example.com/products/watch">

<!-- https://www.example.com/products/watch -->
<link rel="canonical" href="https://example.com/products/watch">

<!-- https://example.com/products/watch?utm_source=email -->
<link rel="canonical" href="https://example.com/products/watch">

<!-- https://example.com/products/watch/  (trailing slash) -->
<link rel="canonical" href="https://example.com/products/watch">
```

**What was wrong with each original tag:**
- `https://example.com/products/watch` — actually correct already (self-referencing the chosen target), no change needed.
- `https://www.example.com/products/watch` — canonicalized to *itself* (the `www` variant), which does nothing to consolidate signal onto the non-`www` version; it should point at the non-`www` target instead.
- `?utm_source=email` — canonicalized to itself **including the tracking parameter**, meaning every future email campaign with a different `utm_source` value would be treated as its own separate "canonical" page — defeating the entire purpose; tracking parameters should never appear in a canonical URL.
- Trailing-slash variant — had no canonical tag at all, meaning search engines discovering it directly had no signal to consolidate it anywhere.

**Complementary fix worth mentioning — server-side redirects:** Canonical tags are a signal, not a redirect — all four URLs remain independently accessible and crawlable unless something else changes that. Where practical, a genuine 301 redirect from the `www` and trailing-slash variants to the canonical URL is a stronger, unambiguous fix than a canonical tag alone (canonical tags are appropriate for variants that must remain independently accessible, like the tracking-parameter URL, which needs to keep working for the email campaign to function, just without being treated as distinct content).
