# Interview Q&A — `@property` and Custom Properties vs. Sass Variables

**Q: Why can't you animate or transition a plain custom property?**
Because plain custom properties are untyped — the browser has no defined way to interpolate between two arbitrary token streams, since it doesn't know what "kind" of value it's dealing with (a color? a length? something else entirely?). Animation/transition requires a known, interpolatable type, which is exactly what `@property`'s `syntax` field provides when a custom property is explicitly registered.

**Q: What three things does `@property` let you configure, and why is `inherits` notable?**
`syntax` (the value's type, e.g. `'<length>'`, `'<color>'`, `'<angle>'`), `initial-value` (the default when nothing else in the cascade sets it), and `inherits` (`true`/`false`). `inherits` is notable because it lets you deliberately opt a custom property OUT of the otherwise-universal default inheriting behavior — something that's impossible for a plain, unregistered custom property, which always inherits.

**Q: What happens if you assign a value to a `@property`-registered custom property that doesn't match its declared `syntax`?**
The declaration is invalid at computed-value time and is dropped — the property falls back to its registered `initial-value`, rather than silently accepting the mismatched value the way an unregistered custom property would (unregistered custom properties accept any token stream with no validation).

**Q: What's the core distinction between a CSS custom property and a Sass variable?**
When the value is resolved. A Sass variable is resolved at compile time via pure textual substitution — it's fully baked into the shipped CSS and has zero presence in the browser afterward. A CSS custom property is resolved at runtime, live, in the browser, following the normal cascade and inheritance — it can be inspected, changed via JavaScript, and can resolve to different values at different points in the DOM tree simultaneously.

**Q: Can a Sass variable respond to a media query or a `:hover` state changing at the value level, the way a custom property can?**
Not directly — a Sass variable has exactly one value, decided once at compile time; achieving conditional values per breakpoint/state in Sass requires writing separate compiled CSS rules for each condition (the Sass variable itself doesn't "change"). A custom property can simply be redeclared inside any selector or media query, and every `var()` reference to it updates automatically as the cascade/DOM state changes, with no separate rule sets needed per condition.

**Q: Is it accurate to say custom properties have made Sass entirely obsolete?**
No — that overstates it. Sass still offers build-time conveniences custom properties don't provide on their own: mixins, functions, loops for generating repetitive rules, and module organization (`@use`/`@forward`). The more accurate framing is that custom properties have specifically displaced Sass *variables* in many modern codebases (since runtime, cascade-aware values are usually the better fit for anything genuinely dynamic, like theming), while Sass itself remains useful for other, unrelated authoring-time features.
