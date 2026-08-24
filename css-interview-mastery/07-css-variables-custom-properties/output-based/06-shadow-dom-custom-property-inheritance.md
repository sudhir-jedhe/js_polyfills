# Does a Custom Property Cross a Shadow DOM Boundary?

```html
<style>
  body {
    --brand-color: teal;
  }
</style>

<my-widget></my-widget>

<script>
  class MyWidget extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          p { color: var(--brand-color, black); }
        </style>
        <p>Widget text</p>
      `;
    }
  }
  customElements.define('my-widget', MyWidget);
</script>
```

**Question:** Does the `<p>` inside `<my-widget>`'s shadow DOM render in `teal`, or does it fall back to `black` (the `var()` fallback)?

**Answer:** `teal` — the custom property crosses the shadow boundary and inherits into the shadow tree normally.

**Why:** Custom properties are one of the few mechanisms deliberately designed to pierce shadow DOM encapsulation — they inherit from a shadow host's *light DOM* context into its shadow tree exactly as they would inherit into any other descendant, following the same "no declaration of its own, so inherit from the nearest ancestor that has one" rule. This is intentional and load-bearing for how web components support external theming: a component author can write internal styles that reference `var(--brand-color, <sensible-default>)`, and any consumer of that component can theme it from the outside simply by setting `--brand-color` somewhere in the regular document (here, on `body`), without the component needing any special API to accept theme values. Shadow DOM otherwise strongly encapsulates styles in both directions (a `<style>` inside the shadow tree doesn't leak out, and most *outside* selectors can't reach in), but custom property inheritance is a deliberate, documented exception to that isolation, specifically to make this cross-boundary theming pattern possible. Note the reverse isn't true: a custom property declared *inside* the shadow tree does not leak back out to affect the light DOM or sibling shadow trees.
