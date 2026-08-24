# `!important` and the Full Cascade Order

Specificity is only *one* ingredient in deciding which declaration wins. The full CSS cascade, from highest to lowest priority, is:

1. **Transition** declarations (animating property values, effectively always win momentarily)
2. **`!important`** declarations in user-agent (browser default) stylesheets
3. **`!important`** declarations in user stylesheets (rare — browser extensions, accessibility overrides)
4. **`!important`** declarations in author stylesheets (your CSS) — layers apply here in **reverse** order (see below)
5. **Animation** declarations
6. Normal (non-`!important`) declarations in author stylesheets — layers apply here in forward order
7. Normal declarations in user stylesheets
8. Normal declarations in user-agent stylesheets (browser defaults, lowest priority)

Within a tier, specificity and then source order (last one wins ties) break the tie.

## `!important`

Appending `!important` to a declaration promotes it into a higher-priority tier of the cascade — it does **not** change the rule's specificity value itself. This is why `!important` beats even inline styles: inline styles are just a very high-specificity *normal* declaration, and normal declarations always lose to `!important` ones.

```css
p { color: red !important; }
```
```html
<p style="color: blue;">text</p>
```
Result: **red**. The inline style has higher specificity than any selector, but `!important` operates one tier above specificity entirely, so it wins regardless.

Two `!important` rules matching the same element still fall back to specificity, then source order, to break the tie — `!important` doesn't make every declaration equal, it just moves the whole comparison into a higher-priority bracket.

## Why `!important` is a code smell (usually)

`!important` doesn't fix specificity problems — it just moves the arms race up a level. Once two `!important` declarations on the same property collide, you're back to fighting with specificity and source order, except now there's no "escape hatch" left; the only way to override an `!important` rule from lower-specificity CSS is with *another* `!important` at equal-or-higher specificity, or from a later cascade layer. Legitimate uses are narrow: utility classes explicitly designed to always win (e.g. a `.u-hidden { display: none !important; }` utility that must override component-level styles), or overriding third-party CSS you can't edit.

## `!important` inside `@layer` reverses priority

This is the detail that surprises even experienced developers: for *normal* declarations, layers declared later win. For `!important` declarations, that order **flips** — an `!important` in an earlier-declared layer beats an `!important` in a later-declared layer, and unlayered `!important` styles have the *lowest* priority of all (the opposite of unlayered normal styles, which have the *highest* priority). See the `@layer` theory file for the full breakdown with an example.
