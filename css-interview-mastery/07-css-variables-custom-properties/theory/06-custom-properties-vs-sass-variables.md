# Custom Properties vs. Sass/Less Variables

This is a classic interview comparison question, and the correct answer hinges on one core distinction: **when** the variable's value is resolved.

## Sass variables: compile-time, textual substitution

```scss
// Sass
$primary-color: #3b82f6;

.button {
  background: $primary-color;
}
```

compiles to plain CSS, with the variable already resolved and gone:

```css
/* compiled output */
.button {
  background: #3b82f6;
}
```

`$primary-color` never exists in the browser at all — it's a build-time convenience for the person writing the Sass source. Once compiled, there is no way to inspect, change, or read `$primary-color` at runtime; the compiled CSS has no memory that a variable was ever involved. Changing a Sass variable's value requires re-running the Sass compiler and re-shipping a new CSS file.

## Custom properties: runtime, live, cascade-aware entries

```css
:root {
  --primary-color: #3b82f6;
}
.button {
  background: var(--primary-color);
}
```

`--primary-color` exists as a genuine, inspectable entry in the browser's computed style for every element it cascades to. It can be read via `getComputedStyle()`, changed via `element.style.setProperty()`, changed by toggling a class/attribute that redeclares it in a different rule, and — the key differentiator — it can have a **different resolved value at different points in the DOM tree at the very same moment**, because of inheritance and per-element cascade overrides (see the cascade/inheritance theory file). None of that is possible with a Sass variable, which resolves to exactly one hardcoded value everywhere it was used, permanently, at compile time.

## Comparison table

| | Sass/Less variables | CSS custom properties |
|---|---|---|
| Resolved | At build/compile time | At runtime, live, in the browser |
| Exists in the browser/DOM | No — fully substituted away, invisible in shipped CSS | Yes — a real, inspectable entry per element |
| Can change without a rebuild | No — requires recompiling and reshipping CSS | Yes — via JS, class toggles, media queries, `:hover`, etc. |
| Cascade/inheritance-aware | No — one value, substituted identically everywhere it's referenced | Yes — can resolve differently per element, following normal cascade/inheritance |
| Responsive to media queries / pseudo-classes at the value level | No — would need separate compiled rules for each condition | Yes — redeclare the custom property inside any selector/media query, and every `var()` reference updates automatically |
| Scoping | Purely lexical/file-based (Sass `@use`, nesting) — a build-time concept | DOM-based — a custom property's "scope" is whatever DOM subtree it cascades/inherits into |
| Type checking | Sass has some type awareness for its own functions, but no connection to actual CSS property types | None by default; opt-in via `@property` (see its own theory file) |
| Animatable | N/A — meaningless, since it's gone before the browser ever sees it | Only if registered via `@property` with an interpolatable `syntax` |

## When you'd still want both together

These aren't mutually exclusive — many real projects use Sass for build-time conveniences (mixins, functions, `@use`/`@forward` module organization, loops for generating repetitive rule sets) *and* custom properties for anything that needs to be genuinely dynamic at runtime (theming, JS-driven values, responsive value changes tied to media queries or state). A common, precise way to frame this in an interview: *"Sass variables answer 'what value should this be when I write the CSS'; custom properties answer 'what value should this be right now, in the browser, for this specific element' — and modern component-heavy, theme-heavy frontend architectures increasingly need the second question answered more than the first, which is a big part of why custom properties have largely displaced Sass variables specifically (not Sass itself) in many codebases."*
