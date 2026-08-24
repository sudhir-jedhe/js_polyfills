# What Does This BEM Class Structure Tell You?

```html
<div class="modal modal--fullscreen">
  <header class="modal__header">
    <h2 class="modal__title">Confirm deletion</h2>
    <button class="modal__close-btn" aria-label="Close"></button>
  </header>
  <div class="modal__body">Are you sure?</div>
  <footer class="modal__footer">
    <button class="modal__action modal__action--danger">Delete</button>
    <button class="modal__action modal__action--secondary">Cancel</button>
  </footer>
</div>
```

**Question:** Without seeing any CSS, what can you infer purely from these class names about the component's structure and variants?

**Answer:** The Block is `modal` — a standalone, reusable component. It has one active Modifier, `--fullscreen`, meaning this specific instance is a full-screen variant of the modal (implying a non-fullscreen default variant exists too). It has five Elements — `__header`, `__title`, `__close-btn`, `__body`, `__footer`, `__action` — each a distinct part that only makes sense as belonging to `modal`, not as standalone reusable classes on their own. `__action` itself has two Modifiers applied across its two usages, `--danger` and `--secondary`, meaning the "action button" element has multiple visual variants selected per-button.

**Why this matters:** this is exactly the value proposition of BEM — the class names alone (no CSS, no visual reference) tell you the component's shape: what it's made of, and what variants exist. A developer unfamiliar with this component could infer "there's probably a `.modal__action--primary` variant too" just from the naming pattern, before even opening the stylesheet.
