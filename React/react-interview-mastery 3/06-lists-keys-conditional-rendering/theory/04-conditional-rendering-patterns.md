*** copy 04-conditional-rendering-patterns.md ***

# Conditional rendering

Common patterns:

```jsx
{isLoggedIn && <Dashboard />}
{isLoggedIn ? <Dashboard /> : <LoginForm />}
{user ?? <GuestBanner />}
if (!data) return <Spinner />;
```

### The `count && <Component />` trap

`&&` short-circuits on any falsy value, but JSX renders the falsy value itself if it isn't `false`, `null`, or `undefined`. `0` is falsy but React *will* render it as text:

```jsx
function Cart({ itemCount }) {
  return (
    <div>
      {itemCount && <Badge count={itemCount} />}
    </div>
  );
}
// itemCount === 0 → renders a literal "0" on the page, not nothing
```

Fix by forcing a boolean or using a ternary:

```jsx
{itemCount > 0 && <Badge count={itemCount} />}
{Boolean(itemCount) && <Badge count={itemCount} />}
{itemCount ? <Badge count={itemCount} /> : null}
```

`NaN` has the same problem and is arguably worse since it's harder to spot in review.

### `&&` vs ternary vs early return

| Aspect | `condition && <X/>` | `condition ? <X/> : <Y/>` | Early `return` |
|---|---|---|---|
| Best for | Show-or-nothing, single branch | Two mutually exclusive branches | Whole-component gating (loading/error/empty states) |
| Falsy-value pitfall | Yes — `0`/`NaN` render literally | No pitfall (both branches explicit) | No pitfall |
| Readability at scale | Degrades with multiple conditions | Degrades with nested ternaries | Best readability for multi-state components |

Use `&&` for simple boolean-only conditions, ternaries for exactly two branches, and early returns when a component has 3+ distinct states.
