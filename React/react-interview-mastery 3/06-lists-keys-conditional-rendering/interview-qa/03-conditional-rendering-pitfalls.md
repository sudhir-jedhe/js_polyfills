*** copy 03-conditional-rendering-pitfalls.md ***

# Interview Q&A: Conditional Rendering Pitfalls

**Q: Why does `{count && <Badge/>}` sometimes render a stray `0` on the page?**

`&&` returns its left operand when that operand is falsy. `0` is falsy, so `0 && <Badge/>` evaluates to `0`, not `false`. JSX treats numbers as renderable content, so React prints `0` as a text node. Only `false`, `null`, and `undefined` are treated as "render nothing." The fix is to force a boolean, e.g. `count > 0 && <Badge/>` or `Boolean(count) && <Badge/>`.

**Q: What values does JSX render as nothing versus as visible content?**

`false`, `null`, `undefined`, and `true` render as nothing. Numbers (including `0` and `NaN`), strings (including `''` renders as nothing visually but is technically an empty text node), and objects/arrays of valid React nodes render as content. This asymmetry — `true`/`false` behave differently from `0`/`1` — is exactly what makes the `count && <X/>` pattern dangerous when `count` can be zero.

**Q: How do you conditionally render one of three or more UI states cleanly?**

Prefer early returns over nested ternaries for readability:

```jsx
function Status({ state }) {
  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorMessage />;
  return <DataView />;
}
```

Nested ternaries (`a ? x : b ? y : z`) work but become hard to read past two branches, and are a common source of misplaced-parenthesis bugs.

**Q: What's wrong with this code, and what does it render?**

```jsx
{items.map((item) => {
  <li key={item.id}>{item.name}</li>;
})}
```

Nothing renders — an empty list. The arrow function uses a block body (`{ ... }`) without a `return` statement, so it implicitly returns `undefined` for every item. `.map()` produces an array of `undefined`s, and React renders each `undefined` as nothing. The fix is either an explicit `return` or converting to an implicit-return arrow: `items.map(item => <li key={item.id}>{item.name}</li>)`.
