# Cascade Layers (`@layer`)

`@layer` lets you group CSS rules into named layers with an explicit priority order, so that layer order — not specificity — decides which normal declaration wins between layers. It's the modern answer to "reset CSS vs. component CSS vs. utility CSS all fighting via specificity hacks."

## Declaring and ordering layers

```css
@layer reset, base, components, utilities; /* declares the priority order up front, low to high */

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .card h1 { font-size: 1.25rem; } /* higher specificity (0,1,1) than base's h1 (0,0,1)... */
}

@layer utilities {
  .text-lg { font-size: 3rem; }
}
```

Layers declared **later** win over layers declared earlier — **regardless of specificity**. `components` beats `base` because it's a later layer, even on a tag that `base` also targets with equal or lower specificity. Specificity is only consulted to break ties *within* the same layer.

## The critical gotcha: unlayered styles beat ALL layered styles (for normal declarations)

Any CSS not wrapped in `@layer` is treated as being in a final, implicit layer that comes *after* every named layer:

```css
@layer utilities {
  .btn { color: blue; }   /* layered */
}
.btn { color: green; }    /* unlayered — WINS, even though .btn has equal specificity in both */
```
Result: **green**. This is the opposite of what many people guess — writing "plain" CSS after a `@layer` block will silently override it. In practice this means: put your reset/vendor CSS in named layers, and be deliberate about whether app-level overrides are layered or not.

## `!important` flips both of these rules

For `!important` declarations specifically:
- Layer priority **reverses**: an earlier-declared layer's `!important` beats a later-declared layer's `!important`.
- Unlayered `!important` has the **lowest** priority of all — every layered `!important` beats it.

```css
@layer reset, components;
@layer reset      { p { color: red !important; } }   /* earlier layer... */
@layer components { p { color: blue !important; } }  /* ...wins for NORMAL, but loses here */
```
Result: **red** — `reset` is declared first, and for `!important` declarations, earlier layers win. This inversion exists so that low-level layers (like a CSS reset) can use `!important` to enforce truly non-negotiable baseline rules that higher, more specific layers can't accidentally clobber.

## Comparison: specificity wars vs. layers

| | Specificity-based override | `@layer`-based override |
|---|---|---|
| What decides the winner | ID/class/type count, then source order | Layer order first, specificity only breaks ties *within* a layer |
| Predictability at scale | Degrades — teams escalate specificity to "win" | Stays predictable — priority is an explicit, readable list |
| Common failure mode | Runaway `!important` and ID-selector arms races | Forgetting unlayered CSS always wins over layered CSS |
