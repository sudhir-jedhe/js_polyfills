# Custom Property Syntax and `var()`

## Declaring a custom property

A custom property is any property name that starts with two dashes (`--`). It can be declared on any selector, just like a normal property:

```css
:root {
  --brand-color: #3b82f6;
  --spacing-unit: 8px;
  --font-stack: 'Inter', system-ui, sans-serif;
}
```

`:root` (equivalent to `html`, but with higher specificity conventions applied by common usage) is the standard place to declare global/theme-level custom properties, since they then cascade and inherit down to every element in the document.

## Reading it with `var()`

```css
.button {
  background: var(--brand-color);
  padding: calc(var(--spacing-unit) * 2);
  font-family: var(--font-stack);
}
```

`var()` performs a *substitution* at computed-value time — the browser looks up the custom property's current cascaded/inherited value for that specific element, and substitutes it in wherever `var()` appears. This is different from a preprocessor's compile-time text substitution (covered in detail in the Sass-comparison theory file) — the lookup genuinely happens live, per element, based on that element's actual position in the cascade and DOM tree.

## Values can be almost any token sequence — custom properties are untyped by default

Unlike normal CSS properties (which only accept a specific, defined value grammar — `color` only accepts color values, `width` only accepts length/percentage/keyword values, etc.), a plain custom property (without `@property`, covered separately) accepts **any sequence of valid CSS tokens** as its value, with no type checking at declaration time:

```css
:root {
  --gap: 16px;              /* a length */
  --primary-hue: 210;       /* just a number, no unit */
  --transition-timing: ease-in-out; /* a keyword */
  --shadow: 0 2px 4px rgb(0 0 0 / 0.1); /* a whole box-shadow value */
}
```

This flexibility is powerful (you can even store partial values, like `--primary-hue: 210;` used later as `hsl(var(--primary-hue) 80% 50%)`), but it also means a custom property doesn't get validated against a specific type until it's actually *used* inside a real property's value — invalid usage only becomes apparent where `var()` is substituted in, not at the point of declaration.

## Custom properties can reference other custom properties

```css
:root {
  --spacing-unit: 8px;
  --spacing-md: calc(var(--spacing-unit) * 2); /* 16px, computed from another custom property */
  --spacing-lg: calc(var(--spacing-unit) * 4); /* 32px */
}
```

This composability is one of the most common practical uses — building a small scale of derived values from a handful of base tokens, all defined once and referencing each other, so changing the single `--spacing-unit` cascades a proportional change through every derived value automatically.

## Custom properties are case-sensitive, unlike most CSS

```css
:root {
  --Brand-Color: red;
  --brand-color: blue;
}
/* these are two DIFFERENT custom properties — CSS property names are normally
   case-insensitive, but custom property names are a documented exception */
```

## Naming convention note

There is no required naming convention, but `kebab-case` (`--primary-color`, not `--primaryColor`) is the overwhelming community standard, matching regular CSS property naming style and avoiding the case-sensitivity trap above entirely if followed consistently.
