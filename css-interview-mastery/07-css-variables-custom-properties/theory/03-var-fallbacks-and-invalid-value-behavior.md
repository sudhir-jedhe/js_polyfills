# `var()` Fallbacks and Invalid-Value Behavior

## Basic fallback syntax

`var()` accepts a second argument — a fallback value used when the referenced custom property is not defined (not set anywhere in the cascade for that element):

```css
.button {
  color: var(--button-text-color, white); /* uses white if --button-text-color is never set */
}
```

## Fallbacks only apply when the custom property is genuinely undefined — not merely "empty" in certain edge cases

```css
:root {
  --gap: ; /* explicitly declared, but with an EMPTY value (a "guaranteed-invalid" value in spec terms, valid to declare) */
}
.box {
  margin: var(--gap, 16px); /* the fallback is NOT used here in most engines' interpretation of empty value */
}
```

This edge case is subtle: an explicitly declared-but-empty custom property is considered "set" (it exists in the cascade with an empty token stream as its value), so `var()` doesn't fall back to `16px` — the empty value is substituted in as-is, which for `margin` (which requires at least one value) makes the whole `margin` declaration invalid at computed-value time (see below), rather than triggering the fallback. Fallbacks are specifically for the custom property being **completely absent** from the cascade at that element (no declaration reaches it at all, including through inheritance).

## The fallback argument can itself contain commas — everything after the first comma is the fallback

```css
.box {
  font-family: var(--font-stack, 'Inter', system-ui, sans-serif);
  /* fallback = 'Inter', system-ui, sans-serif  — the ENTIRE remainder, not just the first item */
}
```

This is a common point of confusion: `var()` only has two logical arguments (the custom property name, and everything else as the fallback), even though the fallback itself may contain multiple comma-separated values, which is essential for properties like `font-family` that are naturally comma-separated lists.

## Nested fallbacks (fallback chains)

```css
.box {
  color: var(--user-color, var(--theme-color, black));
  /* tries --user-color, then --theme-color, then finally the literal 'black' */
}
```

## "Invalid at computed-value time" — a different failure mode than "undefined"

This is a precise and commonly-tested distinction. If a custom property *is* defined, but its substituted value doesn't make sense for the property it's used in (e.g. a custom property holding a keyword being used where a length is required), the situation is called **invalid at computed-value time**, and it behaves differently from a simply-undefined custom property:

```css
:root {
  --size: bold; /* a valid custom property value (any token stream is allowed at declaration time) */
}
.box {
  width: var(--size); /* 'bold' is not a valid <length>, so this fails at computed-value time */
}
```

When a declaration is invalid at computed-value time, the browser doesn't just skip that one declaration and move to the next-highest-priority rule (as happens for a syntax error at parse time) — instead, the property resolves to its **initial value**, or **inherited value** if the property is normally an inherited one, essentially as if `unset` had been used for that specific declaration. This is a meaningfully different (and often confusing, if you don't know to expect it) failure mode compared to how a plain invalid CSS value is normally handled (dropped, falling back to whatever the next cascade rule provides), and it's a detail interviewers use specifically to check whether a candidate actually understands the custom-property substitution model rather than just having memorized "fallbacks work like defaults."

## Fallback vs. `@property`'s `initial-value`

It's worth distinguishing `var()`'s per-usage fallback from `@property`'s `initial-value` (covered in its own theory file) — a fallback only applies at each individual `var()` call site where the property happens to be undefined; `@property`'s `initial-value` is a single, type-checked default applied to the custom property itself, used whenever no cascaded value reaches an element at all, and it also enables the "invalid at computed-value time" behavior above to fall back to that typed initial value specifically, rather than to `unset`/inherited behavior.
