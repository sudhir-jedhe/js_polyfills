***  05-seo-audit-heading-structure-fix.md ***

# Scenario: SEO Audit Flags Broken Heading Structure

**Scenario:** An SEO audit tool flags a product page with: two `<h1>`s (one for the site logo/name in the header, one for the product title), a heading sequence that jumps from `h2` straight to `h5` in the "Specifications" area, and several bold, larger-looking paragraphs that are visually "headings" but are just `<p style="font-weight:bold; font-size:1.5em">` with no real heading tag at all. How do you fix each issue, and why does each one matter?

**Diagnosis and fixes:**

**1. Two `<h1>`s (site name + product title)**

The site logo/name in the header shouldn't be an `<h1>` at all on an inner page — the page's single `<h1>` should represent *this page's* primary topic, i.e. the product title.

```html
<!-- Before -->
<header><h1>MyStore</h1></header>
<main><h1>Wireless Headphones XR-500</h1></main>

<!-- After -->
<header><p class="logo">MyStore</p></header> <!-- or a non-heading element styled as the logo -->
<main><h1>Wireless Headphones XR-500</h1></main>
```

**2. `h2` jumping straight to `h5`**

```html
<!-- Before -->
<h2>Specifications</h2>
<h5>Battery Life</h5>

<!-- After -->
<h2>Specifications</h2>
<h3>Battery Life</h3>
```

The visual size difference between what was `h5` and the desired look is a CSS concern (`font-size` on `h3`), completely separate from picking the semantically correct level.

**3. Bold, large paragraphs standing in for headings**

```html
<!-- Before: looks like a heading, is invisible as one to crawlers/screen readers -->
<p style="font-weight:bold; font-size:1.5em">Customer Reviews</p>

<!-- After -->
<h2>Customer Reviews</h2>
```

**Why each of these matters for SEO specifically:** search engines use heading tags (especially `h1`/`h2`) as a strong, low-noise signal for topical relevance and page structure when building their understanding of a page — a duplicated or missing `h1`, or headings that are visually present but not semantically marked up, all *directly* weaken that signal, independent of the actual quality of the content. The fixes here cost nothing in CSS/visual design; the audit is purely about aligning the *tags* with the *visual hierarchy* that was already intended.
