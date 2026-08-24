# `setProperty('--x', …)` vs. Direct `.style` Assignment — Does It Matter Here?

```js
const el = document.querySelector('.box');

el.style.setProperty('--highlight', 'yellow');
el.style['--highlight'] = 'orange'; // attempted alternative
el.style.color = 'blue'; // for comparison, a normal property
```

**Question:** Does `el.style['--highlight'] = 'orange';` work the same way as `el.style.setProperty('--highlight', 'orange');`? What ultimately determines `--highlight`'s value on `el`?

**Answer:** `el.style['--highlight'] = 'orange';` does **not** reliably set the custom property the way `setProperty()` does — direct property (dot/bracket) access on the `CSSStyleDeclaration` object works for normal, camelCase-mapped CSS properties (`el.style.color = 'blue'` works because `color` is a recognized, directly-settable JS property on `style`), but custom property names aren't exposed as ordinary JS object properties on `style` in the same way, since they aren't part of the fixed, known set of CSS properties the `CSSStyleDeclaration` interface defines accessors for. `setProperty()` is the reliable, spec-correct API for both normal and custom properties, and it's the one that should always be used for custom properties specifically.

**Why this is a common real-world bug:** developers used to setting normal styles via `el.style.propertyName = value` (camelCase, direct assignment) sometimes try the same pattern for a custom property (`el.style.myCustomProp = value` or `el.style['--my-custom-prop'] = value`) and it silently does nothing — no error is thrown, the assignment just fails to register as an actual inline style, because it's not operating through the `CSSStyleDeclaration`'s defined property-setting mechanism. The value of `--highlight` on `el` in this scenario would end up being whatever `setProperty()` last successfully set (`'yellow'`, since the direct-assignment line that followed didn't actually take effect) — and this exact "why isn't my custom property updating from JS" bug is common enough to be a legitimate interview probe for whether a candidate knows to always reach for `setProperty()`/`getPropertyValue()` for custom properties rather than direct dot/bracket access.
