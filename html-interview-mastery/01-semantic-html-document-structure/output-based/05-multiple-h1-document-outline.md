# Output: Multiple `<h1>`s on One Page

```html
<body>
  <header>
    <h1>My Company</h1>
  </header>
  <main>
    <article>
      <h1>Understanding the Event Loop</h1>
      <p>Article body…</p>
    </article>
  </main>
</body>
```

**Question:** Is this valid HTML? Will it pass automated accessibility audits (axe, Lighthouse)?

**Answer:** It's technically **valid HTML** — the spec does not forbid multiple `<h1>` elements. But it will typically fail or generate a warning in Lighthouge/axe-style audits under a rule like "Document should not have more than one H1 element" / heading-order best practices, because it creates ambiguity about which is the actual top-level heading of the page: is the page fundamentally about "My Company" or "Understanding the Event Loop"? Screen reader users jumping to the first `h1` land on the site name, not the article title, and SEO crawlers historically treated a single clear `h1` as a strong topical signal — two competing ones dilute that signal.

**Why:** This is the classic "spec-valid vs. best-practice" gap that trips people up in interviews — the HTML5 spec's *original* content-model design (via the now-abandoned outline algorithm) intended each sectioning root to be allowed its own `h1`, imagining tools would compute a nested outline automatically. Since no browser/AT ever implemented that outline algorithm, the practical, universally-recommended convention — enforced by every major accessibility and SEO auditing tool — is exactly one `h1` per page, with all other headings using `h2`–`h6` to build a single real hierarchy.
