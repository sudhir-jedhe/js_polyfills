*** copy 06-inline-element-block-nesting-error.md ***

# Output: Block Element Inside an Inline Element's "Container" Paragraph

```html
<p>Check out our <a href="/pricing">pricing page</a> for details.
  <ul>
    <li>Free tier</li>
    <li>Pro tier</li>
  </ul>
</p>
```

**Question:** What's the actual resulting DOM structure once the browser parses this?

**Answer:**

```html
<p>Check out our <a href="/pricing">pricing page</a> for details.</p>
<ul>
  <li>Free tier</li>
  <li>Pro tier</li>
</ul>
<!-- the trailing "</p>" in the source becomes a stray closing tag, ignored by the parser -->
```

The `<p>` is force-closed the instant the parser encounters the `<ul>` (a block-level/flow-content element not permitted inside `<p>`'s phrasing-content-only content model). The `<ul>` and its `<li>`s become siblings *after* the `<p>`, not children of it, and the final explicit `</p>` in the source has nothing left to close, so it's discarded.

**Why:** This matters practically because CSS selectors like `p ul` (descendant) would still accidentally match here since `<ul>` is a later sibling wrapped by nothing — but a selector expecting direct nesting, or JS like `p.querySelector('ul')`, would find nothing, because the actual DOM tree doesn't have the `<ul>` inside the `<p>` at all, regardless of how the source code visually indents it.
