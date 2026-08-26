*** copy 05-preload-unused-warning.md ***

# Output: `preload` with a Mismatched `as` Attribute

```html
<link rel="preload" href="/app.js" as="style">
<script src="/app.js" defer></script>
```

**Question:** Does the browser fetch `/app.js` once or twice, and why?

**Answer:** Twice — the browser fetches `/app.js` once for the `preload` (interpreting it as a stylesheet request, because of `as="style"`) and again for the actual `<script>` tag (as a script request), because the two requests aren't recognized as "the same resource for the same purpose."

**Why:** The `as` attribute isn't just a hint for prioritization — it's also part of how the browser matches a preloaded resource to its actual later use, along with the resource's request type/destination and (for cross-origin/font requests) the `crossorigin` mode. A `preload` declared with the wrong `as` value (here, `style` for a file that's actually consumed as a `script`) is treated as a *different* resource request from the actual `<script src="/app.js">` tag, so the browser fetches it twice — the exact opposite of `preload`'s intended effect. The console typically also shows a warning like "the resource was preloaded but not used within a few seconds," confirming the mismatch. The fix is simply `as="script"` to match how the file is actually used.
