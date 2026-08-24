# Interview Q&A — Cascade, Inheritance & Fallbacks

**Q: Do custom properties inherit by default? How does this compare to properties like `border` or `padding`?**
Yes, custom properties inherit by default — this is the opposite of most CSS properties, which do not inherit unless explicitly told to via the `inherit` keyword. `border`, `padding`, `background`, `width`, and most box-model/visual properties are not inherited by default; a handful of typography-related properties (`color`, `font-family`, `line-height`, etc.) do inherit, but that's the exception among normal properties, not the rule — custom properties inheriting unconditionally is the actual exception-to-the-exception worth remembering.

**Q: How does theming with custom properties actually rely on inheritance?**
By redeclaring a handful of custom properties on a wrapping element (e.g. `.dark-theme`, `[data-theme="dark"]`), every descendant that reads those properties via `var()` automatically resolves to the new values, since they inherit the redeclared values from that ancestor — no changes are needed to any individual descendant's own CSS rules.

**Q: What is `var()`'s fallback argument, and when exactly does it get used?**
The second argument to `var()`, used only when the referenced custom property is entirely undefined for that element (not declared anywhere reachable through the cascade or inheritance). It is not used when the property is defined but happens to resolve to an invalid value for the context it's used in — that's a separate failure mode ("invalid at computed-value time").

**Q: If a `var()` fallback needs to contain commas (e.g. a font stack), how does that work syntactically?**
`var()` only ever has two logical arguments: the property name, and everything after the first comma is treated as one single fallback value, even if that fallback itself contains further commas — e.g. `var(--font-stack, 'Inter', system-ui, sans-serif)` uses the entire `'Inter', system-ui, sans-serif` sequence as the fallback, not just `'Inter'`.

**Q: What does "invalid at computed-value time" mean for a custom property, and how is it different from the property simply being undefined?**
It refers to a custom property that IS defined somewhere in the cascade, but whose substituted value doesn't make sense for the specific CSS property it's being used in (e.g. a custom property holding a color keyword being substituted into `width`). In that case, the consuming property resolves to its own initial value (or inherited value, if applicable) — behaving like `unset` for that declaration — rather than triggering `var()`'s own fallback argument, which only applies to genuinely undefined custom properties.

**Q: Does a custom property inherit into `::before`/`::after` pseudo-elements?**
Yes — pseudo-elements are treated as children of their originating element for inheritance purposes, so a custom property declared on (or inherited by) that element is available to its `::before`/`::after` via the normal inheritance chain.
