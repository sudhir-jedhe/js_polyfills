# Output: `<label>` Text vs. `aria-label` — Which Wins?

```html
<label for="search-input">Search products</label>
<input id="search-input" type="text" aria-label="Site search">
```

**Question:** What does a screen reader announce as the accessible name of this input — "Search products" or "Site search"?

**Answer:** **"Site search"** — the `aria-label` value wins. The visible `<label for>` text is completely overridden in the accessibility tree, even though it remains visually displayed on screen exactly as written ("Search products").

**Why:** The accessible name computation algorithm places `aria-label` above native labeling mechanisms (`<label for>`, wrapping labels, or plain text content) in precedence — only `aria-labelledby` outranks it. This produces a real, easy-to-introduce bug: a sighted user reads "Search products" on screen, while a screen reader user hears "Site search" — two different names for the same field, which is confusing for anyone switching between visual and auditory/voice-control modes (e.g. a voice-control user saying "click Search products" — the command they see on screen — would fail, since the programmatically exposed name is actually "Site search"). The fix is almost always to just remove the redundant `aria-label` and let the native `<label>` do its job — `aria-label` should only be used when there's genuinely no visible text to associate.
