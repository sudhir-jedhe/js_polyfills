# Scenario: A Component Library Needs to Be Themeable by Consumers Who Don't Control Its Source

**Scenario:** A team publishes a shared UI component library (e.g. an npm package with a `<Button>`, `<Card>`, `<Modal>`) used across several separate internal products, each with its own distinct brand colors and spacing preferences. Each consuming product needs to visually re-skin the shared components — different accent color, different border radius, slightly different spacing — without forking the library, without every component needing an ever-growing list of style-related props, and ideally without shipping per-product builds of the library itself. How do you design the library's CSS to support this?

**Approach:**

Expose a documented set of custom properties as the library's *theming API* — every visually-customizable value inside the library's own components reads from a `var()` with a library-namespaced custom property name and a sensible default, and consumers theme the library purely by setting those custom properties somewhere in their own document (typically on `:root` or a wrapping container), with no build step or prop drilling required.

```css
/* Inside the library's own CSS — ships as-is, unmodified per consumer */
.uikit-button {
  background: var(--uikit-button-bg, #3b82f6);
  color: var(--uikit-button-text, #ffffff);
  border-radius: var(--uikit-radius, 6px);
  padding: var(--uikit-space-sm, 8px) var(--uikit-space-md, 16px);
}

.uikit-card {
  border-radius: var(--uikit-radius, 6px); /* reuses the same shared radius token */
  padding: var(--uikit-space-md, 16px);
  border: 1px solid var(--uikit-border-color, #e5e5e5);
}
```

```css
/* Inside Product A's own stylesheet — no fork, no rebuild of the library */
:root {
  --uikit-button-bg: #16a34a;   /* Product A's green brand color */
  --uikit-radius: 12px;         /* Product A wants noticeably rounder corners */
}
```

```css
/* Inside Product B's own stylesheet — a completely different theme,
   same unmodified library, even scoped to just one section of the page */
.legacy-section {
  --uikit-button-bg: #7c3aed;   /* purple, but ONLY within .legacy-section, thanks to inheritance scoping */
  --uikit-radius: 2px;          /* sharper corners, only in this subtree */
}
```

**Why this is the right architecture, and what it avoids:** the library never needs to know about any specific consumer's brand at build time — the same published package, byte-for-byte, works correctly for every consumer, because theming happens entirely through the browser's normal cascade/inheritance mechanism at runtime, on the consumer's own document. This avoids three worse alternatives: (1) forking the library per product (a maintenance nightmare as the library evolves), (2) building an ever-growing set of style-related component props for every conceivable customization (bloats the component API and still can't anticipate every future theming need), and (3) requiring per-product build-time compilation of the library with different Sass variables baked in (defeats the purpose of a shared, prebuilt package, and can't be changed at runtime — e.g. Product B's scoped `.legacy-section` override, which relies on live DOM-based inheritance scoping, would be impossible with a compile-time-only variable system). The library only needs to document its custom-property "API surface" (which `--uikit-*` names exist and what they control) — everything else is just normal CSS cascade behavior working as designed.
