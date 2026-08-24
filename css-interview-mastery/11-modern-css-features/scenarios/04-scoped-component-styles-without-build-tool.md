# Scenario: Scoped Component Styles Without a Build Tool

**Situation:** A small marketing site is built with plain HTML/CSS (no bundler, no CSS Modules, no framework), but the team wants to compose pages from reusable "component" HTML partials (a card, a testimonial block, a pricing table) without those components' internal styles leaking onto unrelated elements elsewhere on the page — something that's historically only been solved with either a naming convention (BEM) or build tooling (CSS Modules).

**Approach:** Use `@scope` to get real DOM-boundary style isolation natively, with zero build step.

```html
<section class="testimonial">
  <blockquote>
    <p>This product changed how we work.</p>
  </blockquote>
  <footer>
    <p>— Jordan, Head of Design</p>
  </footer>
</section>

<article class="post">
  <p>Regular blog post content, must NOT be affected by testimonial's <code>p</code> styling.</p>
</article>
```

```css
@scope (.testimonial) {
  blockquote p {
    font-size: 1.3rem;
    font-style: italic;
    color: #111827;
  }
  footer p {
    font-size: 0.9rem;
    color: #6b7280;
  }
}
```

**Why this works:** the `p` selectors inside `@scope (.testimonial) { }` only ever match paragraphs that are descendants of `.testimonial` — a `<p>` inside `.post` elsewhere on the page is completely unaffected, without needing a BEM-style compound class name (`.testimonial__quote`) or a generated unique class from a bundler. This gives genuine DOM-scoped isolation using only a `<link>`/`<style>` tag and no JavaScript build step — a capability plain CSS previously couldn't offer without leaning on naming discipline (which nothing enforces) or descendant selectors repeated on every single rule (`.testimonial blockquote p { }`, `.testimonial footer p { }`, etc., which `@scope`'s wrapping block avoids having to repeat).
