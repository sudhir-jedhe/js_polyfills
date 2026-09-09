***  07-replacestate-back-button-behavior.md ***

# Output: Back Button Behavior After `replaceState`

Sequence of events, starting from `/page-a`:

```js
// currently on /page-a (this is the ONLY entry so far in this session's history for this site)
history.pushState({}, '', '/page-b');   // step 1
history.replaceState({}, '', '/page-c'); // step 2
```

**Question:** After steps 1 and 2, the user clicks the browser's Back button once. What URL do they land on?

**Answer:** `/page-a`.

**Why:** `pushState` (step 1) adds a brand-new entry, so the stack becomes `[/page-a, /page-b]` with `/page-b` current. `replaceState` (step 2) does **not** add a new entry — it overwrites the *current* entry in place, so the stack becomes `[/page-a, /page-c]`, still only two entries, with `/page-c` current. `/page-b` never persisted anywhere in the stack since it was replaced before the user ever navigated away from it. So one Back press moves from `/page-c` straight to `/page-a` — `/page-b` is completely skipped, as if it had never been pushed. This is exactly why `replaceState` is used for "correcting" a URL (e.g., normalizing `/page-b` to `/page-c`) without leaving an extra, confusing Back-button stop.
