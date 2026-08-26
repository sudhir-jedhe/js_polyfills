*** copy 03-renderif-and-the-stray-zero-trap.md ***

# Problem: Implement `renderIf(condition, component)` and Explain the Stray-`0` Trap

## Problem Statement

Implement a `renderIf(condition, component)` utility that renders a component/element only when `condition` is strictly truthy as a *boolean*, and demonstrate exactly why the naive `count && <X />` pattern can render a stray `0` on screen — something `renderIf` is designed to make impossible by construction.

## Requirements

- `renderIf(condition, component)` returns `component` (or the result of calling it, if it's a function/render-prop) when `Boolean(condition) === true`, and `null` otherwise.
- Never returns `0`, `NaN`, `''`, or any other falsy non-boolean value — only ever the rendered content or `null`.
- Accepts either a pre-built element (`renderIf(isOpen, <Modal />)`) or a lazy render function (`renderIf(isOpen, () => <Modal />)`), so expensive-to-construct elements aren't built when the condition is false.
- Includes a side-by-side demonstration of the buggy `count && <Badge />` pattern and the fixed version.

## Approach

The core insight is that `&&` in JavaScript doesn't produce a boolean — it returns whichever operand short-circuited the evaluation. `0 && <X />` evaluates to `0` (a falsy *number*, not `false`), and React happily renders numbers as text, unlike `false`/`null`/`undefined`, which it silently skips. `renderIf` fixes this at the type level: it always coerces `condition` through `Boolean(...)` before branching, so there is no code path that can leak a non-boolean falsy value out as the return value.

## Solution

```jsx
// renderIf: forces the condition through Boolean(...) so a falsy non-boolean
// (0, NaN, '') can never leak out as the "rendered" value — only the real
// content or null ever comes back.
function renderIf(condition, component) {
  if (!Boolean(condition)) return null;
  return typeof component === 'function' ? component() : component;
}

// --- the bug this exists to prevent ---
function BuggyCart({ items }) {
  return (
    <div>
      {/* items.length is 0 when empty -> && returns 0 -> React renders "0" */}
      {items.length && <p>{items.length} item(s) in cart</p>}
    </div>
  );
}

// --- fixed with a manual boolean coercion (the usual manual fix) ---
function FixedCartManual({ items }) {
  return (
    <div>
      {items.length > 0 && <p>{items.length} item(s) in cart</p>}
    </div>
  );
}

// --- fixed with renderIf (impossible to get wrong, since it always coerces) ---
function FixedCartWithHelper({ items }) {
  return (
    <div>
      {renderIf(items.length, () => <p>{items.length} item(s) in cart</p>)}
    </div>
  );
}

// --- verification ---
console.log(renderIf(0, 'shown'));          // null — 0 is falsy, correctly suppressed
console.log(renderIf(false, 'shown'));      // null
console.log(renderIf(1, 'shown'));          // 'shown' — truthy number still renders its content
console.log(renderIf('', 'shown'));         // null — empty string falsy, suppressed
console.log(renderIf(true, () => 'lazy'));  // 'lazy' — lazy function form only invoked when true
```

**Why this works:** By running `condition` through `Boolean(...)` unconditionally before deciding what to return, `renderIf` collapses every falsy input (`0`, `''`, `NaN`, `null`, `undefined`, `false`) onto the same `null` output — there's no way for a falsy-but-not-`false` value to "leak" through the way it does with raw `&&`. The lazy-function form (`component` as a function) is a small but important addition: it means `renderIf(isAdmin, () => <ExpensiveAdminPanel />)` never even constructs the expensive element's props/children when `isAdmin` is false, matching how `&&` and ternaries short-circuit naturally.

**Why the naive `count && <X/>` trap keeps happening:** developers reach for `&&` because it reads naturally as "if condition, show X" and works correctly for booleans, `null`, `undefined`, and non-empty strings/objects. The trap is specifically when the left-hand side is a *number that can legitimately be `0`* (a count, a length, an index) — exactly the case `renderIf`, or the equivalent manual `condition > 0` / `Boolean(condition)` coercion, is meant to guard against.
