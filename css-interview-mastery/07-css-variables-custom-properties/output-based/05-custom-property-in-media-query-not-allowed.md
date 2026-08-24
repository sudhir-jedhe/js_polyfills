# Can a Custom Property Be Used Directly Inside a Media Query Condition?

```css
:root {
  --mobile-breakpoint: 768px;
}

@media (min-width: var(--mobile-breakpoint)) {
  .nav { display: flex; }
}
```

**Question:** Does this media query work as intended — does `.nav` become `display: flex` once the viewport reaches 768px?

**Answer:** No — this is invalid CSS, and the entire `@media` block is ignored by the browser. `.nav` never receives `display: flex` from this rule, at any viewport width.

**Why:** `var()` substitution happens within *property values* inside a style rule's declaration block — it is **not** supported inside media feature conditions (the parenthesized part of an `@media` rule), because media query conditions are evaluated during CSS parsing/matching, in a different processing stage than where custom property cascade resolution applies (custom properties are inherently tied to a specific *element's* position in the DOM/cascade, whereas a media query is evaluated once, globally, against the environment — there's no "element" context for a `var()` inside a media condition to resolve against). Browsers reject the malformed `@media (min-width: var(--mobile-breakpoint))` condition as invalid, and per CSS's error-handling rules for at-rules with an unsupported/invalid prelude, the entire block is dropped, including any rules nested inside it — so `.nav { display: flex; }` never applies, regardless of viewport width. This is a common trap for developers who've internalized "custom properties can go almost anywhere" and don't realize media query conditions are one of the specific exceptions. There is no direct CSS-only workaround for this specific case; achieving "configurable breakpoints" typically requires either hardcoding the breakpoint values directly in each `@media` rule, using a preprocessor to inject the value at compile time (ironically, exactly the compile-time substitution model custom properties are meant to move away from), or handling the breakpoint logic in JavaScript instead.
