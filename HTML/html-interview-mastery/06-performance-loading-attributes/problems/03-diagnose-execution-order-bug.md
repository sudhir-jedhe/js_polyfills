*** copy 03-diagnose-execution-order-bug.md ***

# Problem: Diagnose and Fix a Script Execution-Order Bug

## Problem Statement

A team's page intermittently fails with `Uncaught ReferenceError: initAnalytics is not defined`. The relevant markup is below. Identify the root cause, explain why it's intermittent rather than consistent, and provide a fixed version.

```html
<head>
  <script src="/vendor/tracking-sdk.js" async></script>
  <script src="/vendor/analytics-init.js" async></script>
</head>
```

```js
// analytics-init.js
initAnalytics({ siteId: 'abc123' }); // defined inside tracking-sdk.js
```

## Constraints

- `initAnalytics` is a global function defined by `tracking-sdk.js`.
- `analytics-init.js` calls `initAnalytics` at its top level (not inside any event listener), immediately when it executes.
- Both scripts must remain external files loaded via `<script src>` (no inlining, no bundling into one file).
- The fix must guarantee correct behavior on every page load, not just make the bug less likely.

## Approach

Diagnose first: both scripts use `async`, which gives no guarantee about relative execution order between them — each executes independently, the instant its own download finishes. Since `analytics-init.js` unconditionally calls `initAnalytics` the moment it runs, if `analytics-init.js` happens to finish downloading (and thus execute) before `tracking-sdk.js` has, `initAnalytics` won't exist yet, throwing the `ReferenceError`. This is intermittent because it depends purely on relative network timing of the two files on any given page load — sometimes the SDK wins the race, sometimes the init script does.

## Solution

```html
<head>
  <!-- defer instead of async: guarantees BOTH parsing-non-blocking behavior
       AND strict document-order execution -->
  <script src="/vendor/tracking-sdk.js" defer></script>
  <script src="/vendor/analytics-init.js" defer></script>
</head>
```

```js
// analytics-init.js — unchanged, no code change needed
initAnalytics({ siteId: 'abc123' });
```

**Why this is a complete fix, not just a mitigation:** `defer` scripts always execute in document order — `tracking-sdk.js` is guaranteed to finish executing before `analytics-init.js` begins, on every single page load, regardless of which file's network request happens to complete first. This removes the race condition entirely rather than just narrowing the timing window in which it could occur (which is all a fix like "add a `setTimeout` delay" or manual polling for `window.initAnalytics` would actually achieve).

**Why not just swap the `<script>` order in the HTML and keep `async`?** Reordering the tags has no effect on `async` execution order at all — `async` scripts execute purely based on when each one's download finishes, completely independent of their position in the document. This is precisely the property that makes `async` unsafe for dependent scripts and is the most common misconception this bug pattern tests: source order looks like it should matter, but for `async`, it doesn't.

**Alternative fix if `async` must be kept (e.g., for some unrelated reason):** Wrap the dependent call so it runs only once the dependency is confirmed loaded — e.g., have `tracking-sdk.js` dispatch a custom event (`window.dispatchEvent(new Event('sdk-ready'))`) at the end of its own execution, and have `analytics-init.js` listen for that event before calling `initAnalytics`. This works but is strictly more code and more fragile than simply using `defer`, which solves the same problem as a built-in guarantee.
