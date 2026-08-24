# Problem: Build a `persistedStore` Backed by `localStorage`

## Problem Statement

Implement `createPersistedStore(key, initialValue)`, a small state container that automatically persists its value to `localStorage` on every change, restores it on creation if a saved value already exists, and notifies subscribers both on local changes and when the value changes in another tab.

## Requirements

- `createPersistedStore(key, initialValue)` returns an object with `get()`, `set(newValue)`, and `subscribe(listener)`.
- `get()` returns the current value.
- `set(newValue)` updates the in-memory value, persists it to `localStorage` under `key` (as JSON), and calls every subscribed listener with the new value.
- `subscribe(listener)` registers a callback invoked whenever the value changes (from `set()` **or** from another tab updating the same key), and returns an `unsubscribe` function.
- On creation, if `localStorage` already has a value under `key`, that value is used instead of `initialValue`.
- Changes made in another tab (via the `storage` event) must also update this tab's in-memory value and notify local subscribers — without causing an infinite loop of tabs re-writing to `localStorage` in response to each other.

## Approach

Wrap `localStorage` reads/writes with `JSON.parse`/`JSON.stringify`, keep an in-memory `value` and a `Set` of listener callbacks, and add a single `window.addEventListener('storage', ...)` that only reacts to the relevant key — updating in-memory state and notifying listeners **without** calling `set()` again (which would re-write to storage), since the `storage` event already tells us the write happened elsewhere.

## Solution

```js
function createPersistedStore(key, initialValue) {
  const listeners = new Set();

  const stored = localStorage.getItem(key);
  let value = stored !== null ? JSON.parse(stored) : initialValue;

  function notify() {
    for (const listener of listeners) listener(value);
  }

  function get() {
    return value;
  }

  function set(newValue) {
    value = newValue;
    localStorage.setItem(key, JSON.stringify(value)); // persist
    notify(); // local subscribers react immediately
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener); // unsubscribe
  }

  // Cross-tab sync: another tab's storage event tells us the value already changed
  // on disk — update local state and notify WITHOUT calling set() again (that would
  // re-write to storage, which is unnecessary and harmless here, but wasteful/racy
  // in general — this pattern avoids it cleanly).
  window.addEventListener('storage', (e) => {
    if (e.key !== key || e.newValue === null) return;
    value = JSON.parse(e.newValue);
    notify();
  });

  return { get, set, subscribe };
}

// --- verification ---
const theme = createPersistedStore('theme', 'light');
console.log(theme.get()); // 'light' (or whatever was already saved from a previous session)

const unsubscribe = theme.subscribe((v) => console.log('theme changed to:', v));

theme.set('dark');
// logs: theme changed to: dark
console.log(localStorage.getItem('theme')); // '"dark"'  (JSON-encoded string)

unsubscribe();
theme.set('light');
// no log this time — listener was removed

// Simulate what happens when another tab changes 'theme':
// window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: '"dark"' }));
// -> value updates and any still-subscribed listeners fire, without this tab re-writing localStorage
```

**Why this avoids a feedback loop:** `set()` is the only path that writes to `localStorage`; the `storage` event handler only ever *reads* the already-changed value and updates local state/listeners — it never calls `set()` or `localStorage.setItem()` itself. Since the `storage` event never fires on the tab that made the write in the first place (a core Web Storage guarantee), there's no risk of a tab reacting to its own change and re-triggering the event.
