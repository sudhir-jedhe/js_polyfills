***  02-pushstate-does-not-trigger-popstate.md ***

# Output: Does `pushState` Trigger `popstate`?

```js
window.addEventListener('popstate', () => {
  console.log('popstate fired, path:', location.pathname);
});

console.log('before pushState');
history.pushState({}, '', '/new-path');
console.log('after pushState, path:', location.pathname);
```

**Question:** What gets logged, and in what order?

**Answer:**
```
before pushState
after pushState, path: /new-path
```
`popstate` never fires as a result of this code.

**Why:** `pushState` (and `replaceState`) change the URL and history stack **synchronously and silently** — they do not dispatch any event on the page that called them. `popstate` fires **only** when the browser actually navigates through session history: the user clicking Back/Forward, or code calling `history.back()`/`forward()`/`go()`. This is why every hand-rolled SPA router must call its render/view-update function manually right after `pushState` — the router cannot rely on `popstate` to cover programmatic navigation, only browser-triggered history traversal.
