# Interview Q&A — Custom Property Fundamentals

**Q: What's the syntax for declaring and reading a custom property?**
Declared with a double-dash prefix on any selector: `--my-property: value;`. Read anywhere a value is expected via `var(--my-property)`, optionally with a fallback: `var(--my-property, fallback-value)`.

**Q: Are custom properties type-checked, by default?**
No — by default, a custom property accepts any sequence of valid CSS tokens as its value, with no type validation at the point of declaration. Type checking only becomes available if the property is registered with `@property` and given an explicit `syntax`.

**Q: Where is it conventional to declare global/theme-level custom properties, and why?**
On `:root` (equivalent to `html`, matched with slightly higher specificity conventions in common usage), since declaring them there makes them cascade and inherit down to every element in the document, which is exactly the behavior needed for global theme tokens.

**Q: Can a custom property's value reference another custom property?**
Yes — `--spacing-lg: calc(var(--spacing-unit) * 4);` is valid and common, letting you build a scale of derived values from a small set of base tokens.

**Q: Are custom property names case-sensitive?**
Yes — unlike most CSS property names (which are case-insensitive), custom property names are explicitly case-sensitive, so `--Brand-Color` and `--brand-color` are two entirely distinct properties. Sticking to a consistent naming convention (kebab-case is standard) avoids this becoming a real source of bugs.

**Q: What happens if you reference a custom property with `var()` but it was never declared anywhere in the cascade for that element, and no fallback is given?**
The property the `var()` is used inside of resolves as if it had been declared with an invalid value — for most properties, this generally means the property falls back to its initial value (or inherited value, if it's normally an inherited property), essentially behaving as `unset` would for that one declaration.
