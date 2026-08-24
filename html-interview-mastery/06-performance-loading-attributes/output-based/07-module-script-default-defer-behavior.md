# Output: `type="module"` Script Ordering

```html
<script type="module" src="a.js"></script>
<script type="module" src="b.js"></script>
<script src="c.js"></script>
```

`a.js` takes 300ms to fetch, `b.js` takes 50ms, `c.js` is a plain (non-module) script that's already cached (instant).

**Question:** What order do these three scripts execute in?

**Answer:** `c.js` executes first (immediately, since it's a plain blocking script that runs synchronously as soon as the parser reaches it), then `a.js`, then `b.js` — in that document order, both **after** HTML parsing has completed.

**Why:** `c.js` is a plain script, so it blocks parsing and executes right away, in its actual document position, regardless of the module scripts around it — parsing literally cannot proceed past it until it runs. `type="module"` scripts are deferred **by default**, without needing an explicit `defer` attribute — they're fetched in parallel (not blocking parsing) and execute in document order (`a.js` before `b.js`) only after the document has finished parsing, exactly like `defer` semantics. So even though `b.js` downloads faster than `a.js`, it still waits for `a.js` to execute first, because module scripts preserve document order the same way `defer` scripts do — this is a key difference from `async`, where faster-downloading scripts can leapfrog slower ones.
