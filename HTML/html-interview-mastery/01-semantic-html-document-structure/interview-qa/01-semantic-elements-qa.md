*** copy 01-semantic-elements-qa.md ***

# Interview Q&A — Semantic Elements

**Q: What's the difference between `<article>` and `<section>`?**
`<article>` is for self-contained content that would still make sense if syndicated or moved to a completely different page/site on its own (a blog post, a forum comment, a product listing). `<section>` is a thematic grouping within a larger document that doesn't stand alone (a "Reviews" section on a product page). Articles can contain sections; sections can contain articles — the distinction is about which one is the standalone unit.

**Q: When is it still correct to use a `<div>` instead of a semantic element?**
When there's genuinely no semantic meaning to express — purely a layout wrapper for CSS Grid/Flexbox, or a generic hook for a JS widget's internal structure. The rule of thumb is to reach for the most specific semantic element first and fall back to `<div>`/`<span>` only when nothing more specific applies; forcing a `<section>` with no heading purely for styling is arguably worse than a `<div>` because it pollutes the accessibility tree with a meaningless landmark.

**Q: Can a page have more than one `<header>` or `<footer>`?**
Yes — they're scoped to their nearest sectioning ancestor, not the page globally. An `<article>` can have its own `<header>` (byline, date) and `<footer>` (tags, author bio) independent of the page-level `<header>`/`<footer>`. Only when a `<header>`/`<footer>` is a *direct child of `<body>`* does it get the `banner`/`contentinfo` landmark role — nested ones inside `<article>`/`<section>` don't.

**Q: What landmark role does `<main>` expose, and how many should a page have?**
`role="main"`. There should be exactly one visible `<main>` per page — it represents the dominant, unique content, excluding repeated boilerplate like nav/header/footer. Screen readers offer a "jump to main content" shortcut that relies on there being one unambiguous target.

**Q: Does `<section>` always create an accessibility landmark?**
No — only when it has an accessible name (via a heading, `aria-label`, or `aria-labelledby`) does it get exposed as a `region` landmark. An unlabeled `<section>` is not announced as a landmark and behaves, for AT purposes, like a generic container — this is a common gotcha, since people assume the tag alone is enough.

**Q: Why might using semantic tags "just for styling hooks" without regard to meaning be a problem?**
Every semantic element carries an implicit ARIA role and (for landmark elements) becomes part of the accessibility tree's landmark list. Sprinkling `<article>` or `<aside>` around content that isn't actually self-contained or tangential adds noise/incorrect landmarks that screen reader users then have to sift through — it's not a neutral choice the way an extra `<div>` class is.
