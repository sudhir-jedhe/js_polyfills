# Rendering Lists and Conditionals

Lists are just `.map()` returning an array of elements — JSX handles arrays of elements fine (unlike a single root, which must be one value). Conditional rendering has three idiomatic forms:

```jsx
{isLoading && <Spinner />}                 // render-or-nothing
{isError ? <ErrorBanner /> : <Content />}  // render-one-of-two
if (!user) return <LoginPrompt />;          // early return, outside JSX
```

## The `&&` trap

If the left side is `0` (a falsy number, not `false`), React renders the literal `0` on screen instead of nothing:

```jsx
{items.length && <List items={items} />}     // renders "0" when items is empty!
{items.length > 0 && <List items={items} />} // correct
```

React skips rendering `false`, `null`, `undefined`, and `true` silently, but it *does* render numbers — including `0` — as literal text. Since `&&` returns its left operand when that operand is falsy (not the boolean `false`), any left-hand side that can be `0` needs to be coerced to a real boolean first (`> 0`, `!!value`, `Boolean(value)`).

## `&&` vs. ternary

| Aspect | `condition && <X />` | `condition ? <X /> : <Y />` |
|---|---|---|
| Use case | Render something or nothing | Render one of two alternatives |
| Falsy pitfall | Renders `0`/`NaN` literally if condition isn't a real boolean | No falsy-value pitfall — both branches are explicit |
| Readability | Very terse for single-branch cases | Clearer when there's a real "else" |

Use `&&` only when the condition is guaranteed to be a boolean (e.g. `items.length > 0`, not `items.length`). The most common mistake is `count && <Badge />`, which renders `0` on screen when `count` is `0`.

## Early return vs. inline conditionals

An early `return` exits the component function before building any JSX for that render path at all — clearest when an entire component has one dominant "empty/error/loading" state to short-circuit on. Overusing deeply nested ternaries inside JSX hurts readability; that's usually a sign to switch to an early return or extract a sub-component.
