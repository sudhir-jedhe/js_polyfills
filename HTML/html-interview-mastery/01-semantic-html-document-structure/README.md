*** copy README.md ***

# Semantic HTML & Document Structure

Semantic HTML is about choosing elements for what they *mean*, not just how they look. `<div>` and `<span>` are meaningless containers — a browser, screen reader, or search engine crawler learns nothing from them. `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` communicate structure and purpose directly in the markup, which the accessibility tree, SEO crawlers, and future maintainers all rely on. This topic is one of the most commonly probed "do you actually know HTML, not just CSS/JS" areas in interviews, because it's easy to *use* semantic tags without understanding the rules that govern them (the document outline algorithm, when a `<div>` is still the right choice, void vs. normal elements, and what quirks mode silently breaks).

## Folder structure

- **`theory/`** — semantic elements vs. generic containers, the document outline algorithm and heading hierarchy, void vs. normal elements, doctype/quirks mode/validation, why semantics matter for SEO/accessibility/maintainability, and block vs. inline elements at the HTML level.
- **`snippets/`** — 6 runnable markup examples: a full landmark skeleton, article/section usage, multi-nav pages, void elements, figure/figcaption, and block vs. inline elements.
- **`output-based/`** — 6 "what does this render/how does this behave?" questions covering the accessibility tree, heading outlines, and quirks mode.
- **`scenarios/`** — 5 real-world situations: refactoring div soup, a multi-article blog page, a multi-nav accessible site, a legacy quirks-mode bug, and an SEO heading audit.
- **`interview-qa/`** — 3 themed files: semantic elements, document structure/doctype, and block/inline/void fundamentals.
- **`problems/`** — 4 hands-on build challenges: a semantic blog post page, a full landmark site shell, fixing HTML validation errors, and building a correct heading outline from content.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- The full landmark element set (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`) and precisely when each beats a `div`
- The document outline algorithm, heading hierarchy (`h1`–`h6`), and why "one `h1` per page" is a practical convention, not a hard spec rule
- Void elements (`br`, `hr`, `img`, `input`, `meta`, `link`, etc.) vs. normal elements — syntax, self-closing myths, and HTML vs. XHTML/XML differences
- `<!DOCTYPE html>`, quirks mode vs. standards mode vs. limited-quirks mode, and HTML validation
- Why semantic HTML matters concretely for SEO (crawler weighting), accessibility (the accessibility tree screen readers consume), and long-term maintainability
- Block vs. inline elements as an HTML-level concept (content categories), distinct from the CSS `display` property that can override it
