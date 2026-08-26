*** copy 01-div-soup-vs-landmarks-accessibility-tree.md ***

# Output: Div Soup vs. Semantic Landmarks in the Accessibility Tree

```html
<!-- Version A -->
<div class="header">
  <div class="nav"><a href="#">Home</a></div>
</div>
<div class="main">
  <div class="content">Welcome!</div>
</div>

<!-- Version B -->
<header>
  <nav><a href="#">Home</a></nav>
</header>
<main>
  <p>Welcome!</p>
</main>
```

**Question:** Both versions render visually identically with the right CSS. What's the actual functional difference?

**Answer:** Version A exposes **zero landmarks** to the accessibility tree — every `<div>` is a generic container with no role, so a screen reader user has no way to jump directly to "navigation" or "main content"; they must read through everything linearly. Version B exposes `banner` (header), `navigation` (nav), and `main` as distinct landmark regions, letting assistive technology users jump straight to any of them via a landmarks shortcut (e.g. the VoiceOver rotor or NVDA's landmark navigation, typically the `D` key).

**Why:** Landmark roles come from the *element*, not from class names or visual styling — `class="header"` on a `<div>` carries no semantic weight to a browser or screen reader; only the actual tag (or an explicit `role="banner"` attribute) does.
