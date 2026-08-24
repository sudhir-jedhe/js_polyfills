# Output: Two `async` Scripts — Which Runs First?

```html
<script src="slow.js" async></script>
<script src="fast.js" async></script>
```

`slow.js` takes 500ms to download. `fast.js` takes 20ms to download.

**Question:** Which script executes first?

**Answer:** `fast.js`, even though `slow.js` appears first in the document.

**Why:** `async` scripts execute as soon as their individual fetch completes, with **no guarantee of document order** relative to other `async` scripts — only relative to their own download time. Since `fast.js` finishes downloading in 20ms and `slow.js` takes 500ms, `fast.js` executes almost immediately while `slow.js` is still in flight, and `slow.js` executes later, whenever its fetch finally completes. This is precisely why `async` is only safe for scripts with **no dependency on each other or on execution order** — if `fast.js` happened to depend on something `slow.js` was supposed to set up first, this would break, unpredictably, based purely on network timing that can vary between page loads.
