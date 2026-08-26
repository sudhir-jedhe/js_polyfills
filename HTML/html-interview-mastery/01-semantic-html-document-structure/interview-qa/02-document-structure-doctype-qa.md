*** copy 02-document-structure-doctype-qa.md ***

# Interview Q&A — Document Structure & DOCTYPE

**Q: What does `<!DOCTYPE html>` actually do?**
In a modern browser, its only functional purpose is to trigger standards mode instead of quirks mode. It's not a version declaration and, unlike the old HTML4/XHTML doctypes, the browser doesn't fetch or validate against any external DTD — `<!DOCTYPE html>` is simply the shortest string that reliably triggers standards-compliant rendering.

**Q: What happens if the doctype is missing or something appears before it in the source?**
The browser falls back to quirks mode, which emulates old (pre-2000s) rendering bugs — most notably the "quirks" box model where `width` absorbs padding and border, plus assorted table-sizing and font-inheritance quirks. You can check the active mode at runtime via `document.compatMode` (`"CSS1Compat"` = standards, `"BackCompat"` = quirks).

**Q: Does the document outline algorithm (where sectioning elements "reset" heading levels) still apply in browsers today?**
No — it was part of the original HTML5 spec but no browser or screen reader ever fully implemented it, and it was removed from the spec. The heading levels you actually write (`h1`–`h6`) are what assistive technology uses directly; nesting inside `<article>`/`<section>` does not implicitly change a heading's effective level.

**Q: Is it valid to have multiple `<h1>` elements on one page?**
Technically yes per the spec, but it's a near-universal best-practice violation flagged by every major accessibility/SEO audit tool, because it creates ambiguity about the page's actual primary topic and disrupts the "one clear top-level heading" convention that screen reader navigation and search engines both rely on.

**Q: What's the practical difference between "HTML doesn't render an error" and "HTML is valid"?**
Browsers implement an error-correcting parser that must always produce *some* DOM, even from malformed markup (unlike XML, which fails hard). Invalid nesting (e.g. a `<div>` inside a `<p>`) gets silently auto-repaired by the parser according to spec-defined recovery rules, so the page can look completely fine visually while the actual DOM structure — and therefore what CSS selectors, JS traversal, and AT see — doesn't match what the author intended. Validation catches this gap; visual QA does not.

**Q: Name three things that would fail HTML validation even if the page renders correctly.**
Any of: an `<img>` without an `alt` attribute, duplicate `id` values on the same page, a `<div>` nested inside a `<p>`, using an obsolete element like `<center>` or `<font>`, or a `<script src="...">` written as a self-closing tag (`<script src="app.js" />`).
