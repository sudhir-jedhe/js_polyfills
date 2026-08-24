# Invalid Custom Property Value: Fallback, `unset`, or `@property`'s `initial-value`?

```css
@property --gap {
  syntax: '<length>';
  initial-value: 10px;
  inherits: true;
}

.box-a {
  --gap: 10px;
  padding: var(--gap, 20px);
}

.box-b {
  --gap: not-a-length; /* invalid for the registered <length> syntax */
  padding: var(--gap, 20px);
}

.box-c {
  padding: var(--gap, 20px); /* --gap never declared on .box-c or any ancestor */
}
```

**Question:** What is the computed `padding` for `.box-a`, `.box-b`, and `.box-c`?

**Answer:** `.box-a` → `10px`. `.box-b` → `10px`. `.box-c` → `10px`.

**Why:** `.box-a` sets a valid `<length>` value, so `--gap` resolves to `10px` normally, and the `var()` fallback (`20px`) is irrelevant since the property is validly defined — `padding` computes to `10px`. `.box-b` sets a value (`not-a-length`) that is **invalid for the registered `<length>` syntax** — because `--gap` is registered via `@property`, an invalid assignment doesn't just get used verbatim (unlike a plain, unregistered custom property, which would accept any token stream) — the declaration `--gap: not-a-length;` is invalid at computed-value time, so `--gap` falls back to its registered `initial-value`, `10px`. The `var(--gap, 20px)` fallback is still not used here, because `--gap` IS considered "set" (it resolves to the registered initial value, not to "undefined") — `var()`'s own fallback argument only kicks in when the custom property is entirely absent from the cascade, not when it's present-but-invalid. `.box-c` never declares `--gap` at all — but because it's registered via `@property` with `initial-value: 10px`, that registered initial value applies globally as the property's default wherever nothing else in the cascade sets it, so `--gap` still resolves to `10px`, and again, the `var()` fallback of `20px` is never reached, since a `@property`-registered custom property is never truly "undefined" the way a plain custom property can be — it always has at least its `initial-value`.

**The one case where `20px` *would* actually be used:** if `--gap` were a plain, unregistered custom property (no `@property` at all) and never declared anywhere in the cascade for that element — only then would it be genuinely absent, and `var()`'s fallback would apply.
