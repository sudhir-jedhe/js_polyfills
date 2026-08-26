*** copy 02-document-outline-and-heading-hierarchy.md ***

# Document Outline and Heading Hierarchy

## The (deprecated) document outline algorithm

Early HTML5 specced an algorithm where sectioning elements (`<article>`, `<section>`, `<aside>`, `<nav>`) would each start a "fresh" heading context — meaning you could theoretically reuse `<h1>` inside every `<section>` and browsers/AT would compute the correct nested outline automatically. **No browser or screen reader ever fully implemented this algorithm**, and it was formally removed from the HTML spec. In practice, the actual heading levels you write (`h1`–`h6`) are what assistive technology uses to build its navigation tree — not an inferred outline based on sectioning nesting.

**Practical consequence:** don't rely on sectioning elements to "reset" heading levels. Write heading levels that reflect a real, single, page-wide hierarchy.

## Heading hierarchy rules that actually matter

1. **Use exactly one `<h1>` per page** in practice, even though the spec technically permits more — it's the strongest, most reliable convention for both SEO and accessibility tooling (axe, Lighthouse, WAVE all flag multiple/missing `h1`s).
2. **Don't skip levels going *down*** (`h1` → `h3` with no `h2`) — screen reader users navigating by heading level expect a continuous hierarchy; a jump implies a missing subsection.
3. **You can skip levels going *up*** — after a deeply nested `h4`, it's fine to go back up to `h2` for a new top-level section.
4. **Never pick a heading level for its default font size.** If `<h3>` looks visually right but the content is actually a top-level section, that's a CSS problem (`font-size` on `h2`), not a reason to mis-tag the heading.

## Example: correct vs. broken hierarchy

```html
<!-- Correct: continuous, no skipped levels going down -->
<h1>Annual Report</h1>
  <h2>Financial Summary</h2>
    <h3>Revenue</h3>
    <h3>Expenses</h3>
  <h2>Team Highlights</h2>

<!-- Broken: skips h2 entirely -->
<h1>Annual Report</h1>
  <h3>Revenue</h3> <!-- screen reader users hear a jump from level 1 to level 3, implying missing structure -->
```

## Landmarks + headings = the real navigable outline

Screen reader users build a mental map of a page two ways: jumping between **landmarks** (`main`, `nav`, `aside`, etc.) and jumping between **headings** (via a rotor/heading-list shortcut, e.g. `H` key in NVDA/JAWS, or the VoiceOver rotor). These two systems are independent and complementary — landmarks say "what kind of region is this," headings say "what's the hierarchy of content within it." A well-structured page needs both: `<nav>` alone doesn't tell you what's *inside* the nav without also having real link text, and `<h2>` alone doesn't tell you it's inside the "complementary" region without a wrapping `<aside>`.

## Using DevTools/tools to inspect the outline

- Chrome DevTools → Elements → Accessibility pane shows the computed accessibility tree, including landmark roles.
- The browser extension **"HeadingsMap"** or Lighthouse's accessibility audit will flag skipped heading levels and multiple `h1`s.
- `document.querySelectorAll('h1,h2,h3,h4,h5,h6')` in the console is a quick manual sanity check of the actual heading sequence on a rendered page.

## Headings inside `<article>`/`<section>` still count toward the *one* page hierarchy

```html
<h1>Tech Blog</h1>
<main>
  <article>
    <h2>Post Title</h2>       <!-- NOT a fresh h1 — it's the second-level heading of the whole page -->
    <h3>A Subheading in the Post</h3>
  </article>
</main>
```

If a page lists 10 blog post previews, each with its own `<h2>` title inside its own `<article>`, that's fine — multiple `<h2>`s at the same conceptual level are completely normal. It's multiple `<h1>`s (multiple *competing top-level* headings) that's the actual anti-pattern.
