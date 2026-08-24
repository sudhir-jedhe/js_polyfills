# `@property`: Typed Custom Properties

By default, a custom property is completely untyped — it accepts any token sequence, and the browser has no idea whether it's "supposed to be" a color, a number, or a length until it's substituted into an actual property. This causes a real, practical limitation: **the browser cannot animate/transition a plain custom property**, because animation requires knowing the value's type in order to interpolate between a start and end value (you can't meaningfully "tween" between two arbitrary, untyped token streams). `@property` solves this by letting you register a custom property with an explicit **syntax** (type), an **initial value**, and whether it **inherits**.

## Syntax

```css
@property --highlight-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

- `syntax`: the value type, using CSS's data-type syntax strings — common ones include `'<color>'`, `'<length>'`, `'<number>'`, `'<percentage>'`, `'<angle>'`, `'<integer>'`, or a pipe-separated list of specific keywords like `'small | medium | large'`. A universal, untyped fallback (`'*'`) is also allowed, opting back out of type-checking while still getting the other `@property` benefits.
- `initial-value`: the property's value when no other declaration in the cascade sets it (comparable to how normal CSS properties always have a well-defined initial value, unlike untyped custom properties, which have none).
- `inherits`: `true` or `false` — this is a required field with `@property`, and it's worth noting explicitly: **you can opt a registered custom property OUT of the default inheriting behavior**, which is otherwise impossible for a plain (unregistered) custom property.

## What `@property` unlocks: actually animatable custom properties

```css
@property --highlight-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.card {
  background: conic-gradient(from var(--highlight-angle), gold, transparent 40%);
  transition: --highlight-angle 0.6s ease;
}

.card:hover {
  --highlight-angle: 360deg;
}
```

Without `@property`, this `transition` would simply not work — the browser would treat `--highlight-angle` as an opaque, untyped token stream and be unable to interpolate between `0deg` and `360deg`, so the gradient would jump instantly rather than sweep smoothly. With the type registered as `<angle>`, the browser knows exactly how to interpolate the value frame by frame, and the transition animates correctly.

## Type validation at declaration time

```css
@property --spacing {
  syntax: '<length>';
  initial-value: 8px;
  inherits: true;
}

.box {
  --spacing: bold; /* INVALID — 'bold' is not a <length>; this declaration is dropped entirely */
  padding: var(--spacing); /* resolves to the registered initial-value, 8px, not 'bold' */
}
```

This is a genuinely useful safety net a plain custom property doesn't provide — a typo or a wrong value assigned to a registered custom property is caught and rejected at the point of declaration (falling back to `initial-value`), rather than silently propagating an invalid value that only surfaces as broken output wherever it's eventually substituted via `var()`.

## Registering via JavaScript instead of CSS

```js
CSS.registerProperty({
  name: '--highlight-angle',
  syntax: '<angle>',
  initialValue: '0deg',
  inherits: false,
});
```

Functionally equivalent to the `@property` at-rule — useful when the registration needs to happen conditionally or be computed at runtime, though for most static design-system use cases, the CSS at-rule form is simpler and preferred.

## Quick comparison: plain custom property vs. `@property`-registered

| | Plain `--x` | `@property`-registered `--x` |
|---|---|---|
| Type-checked | No — accepts any token stream | Yes — validated against `syntax` |
| Has a real initial value | No — simply absent if never set | Yes — explicit `initial-value` |
| Animatable/transitionable | No | Yes, if `syntax` is a type the browser can interpolate (not `'*'`) |
| Inheritance behavior | Always inherits | Configurable via `inherits: true/false` |
