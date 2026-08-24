# Interview Q&A — Pseudo-Classes vs Pseudo-Elements

**Q: What's the fundamental difference between a pseudo-class and a pseudo-element?**
A pseudo-class selects a real element based on state or position (`:hover`, `:nth-child()`) — it's still the same DOM node, just matched conditionally. A pseudo-element selects a generated, virtual sub-part of an element that has no corresponding DOM node (`::before`, `::first-line`) — the browser creates it purely for rendering purposes.

**Q: Why does `:before` (single colon) still work in modern browsers if the correct syntax is `::before`?**
For backwards compatibility. CSS2 only had single-colon syntax and didn't distinguish pseudo-elements from pseudo-classes syntactically. CSS3 introduced `::` specifically for pseudo-elements, but browsers kept accepting the old single-colon form for the four pseudo-elements that existed in CSS2 (`:before`, `:after`, `:first-line`, `:first-letter`) so old stylesheets wouldn't break. Any pseudo-element introduced after CSS3 (like `::placeholder` or `::marker`) only has double-colon form.

**Q: Can you chain multiple pseudo-classes on one selector? What about pseudo-elements?**
Yes for pseudo-classes — `a:hover:not(.disabled):focus-visible` is valid, each one narrows the match further. No for pseudo-elements — you can't chain `::before::after` or `::first-line::first-letter`; only one pseudo-element is allowed per compound selector, and it must come last.

**Q: Does `li:first-child` require the element to be a `<li>` that's literally the first thing in the markup, or the first child among only `<li>` siblings?**
`:first-child` (unlike `:first-of-type`) checks whether the element is the very first child of its parent, period — regardless of tag. `li:first-child` matches an `<li>` only if it is both an `<li>` *and* happens to be its parent's first child overall (i.e. no non-`<li>` element precedes it). If a `<ul>` started with a stray text node or another element type before the first `<li>`, that first `<li>` would not match `:first-child`.

**Q: Give a real use case for `::first-letter` beyond drop caps.**
Styling the leading letter differently in stylized editorial headers, or (combined with `text-transform`) creating a small-caps-style visual effect on just the first character of a heading without wrapping it in an extra `<span>` in the markup.
