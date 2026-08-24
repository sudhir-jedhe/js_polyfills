# Native Cascade Layers: `@layer`

`@layer` is a browser-native CSS feature that formalizes what ITCSS previously achieved only through file/import discipline: explicit control over which group of rules wins, **independent of both specificity and source order**.

## The core rule

Without `@layer`, when two rules conflict, the browser first compares specificity, and only falls back to source order if specificity is tied. With `@layer`, layer order is checked **first** — a rule in a later-declared layer always beats a rule in an earlier-declared layer, no matter how much higher the earlier layer's specificity is. Only within the same layer (or for un-layered rules, which form their own implicit final layer) does normal specificity/source-order resolution apply.

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer components {
  .card { padding: 2rem; } /* specificity (0,1,0) */
}

@layer utilities {
  .p-0 { padding: 0 !important; } /* deliberately still highest priority via !important */
}

@layer base {
  #hero { padding: 4rem; } /* specificity (1,0,0) — normally unbeatable by a class */
}
```

Even though `#hero` in the `base` layer has an ID selector (1,0,0) — far higher specificity than `.card`'s (0,1,0) in the `components` layer — if both somehow targeted the same element, the **later-declared layer wins regardless of specificity**. This is the headline feature: `@layer` lets you say "utilities always beat components, which always beat base styles" as a structural guarantee, instead of hoping every author keeps specificity low enough for that to hold naturally.

## Declaring layer order up front

```css
@layer reset, base, components, utilities; /* order declared once, layers can be filled in anywhere/anytime after */
```

This single statement fixes the priority order regardless of the order the layers are actually *populated* later in the file (or across separate files/imports) — useful because it decouples "what order do I define these rules in" from "what order do they take effect in."

## Unlayered CSS always wins

Any CSS **not** inside an `@layer` block is treated as being in an implicit final layer that comes after all named layers — so unlayered styles (e.g. a quick inline `<style>` override, or legacy CSS not yet migrated into the layer system) always beats layered styles, regardless of specificity. This is intentional: it makes `@layer` adoption incremental-safe, since existing unlayered CSS keeps working exactly as before even as you migrate parts of the codebase into layers.

## `@layer` vs ITCSS

| Aspect | ITCSS (convention) | `@layer` (native) |
|---|---|---|
| Enforcement | Discipline + file/import order — nothing stops a specificity war within it | Browser-enforced — layer order wins over specificity, always |
| Requires build tooling | No, but commonly paired with Sass for the `Settings`/`Tools` layers | No — plain CSS feature, works with or without a bundler |
| Can 3rd-party CSS participate? | Only if it follows your conventions | Yes — you can wrap a 3rd-party stylesheet's import in `@layer thirdparty { ... }` to control exactly how much priority it gets, even if its own selectors are highly specific |
| Migration | All-or-nothing reorganization | Incremental — un-layered legacy CSS keeps outranking everything until you choose to layer it |

In practice, teams increasingly use `@layer` to *implement* an ITCSS-like structure natively — e.g. `@layer reset, elements, objects, components, utilities;` — getting the reliability of native layer precedence while keeping the same conceptual generic-to-explicit ordering ITCSS describes.
