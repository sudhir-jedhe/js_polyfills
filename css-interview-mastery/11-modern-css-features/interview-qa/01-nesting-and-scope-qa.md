# Interview Q&A — Native Nesting & `@scope`

**Q: Does native CSS nesting require a preprocessor like Sass?**
No — it's a native, standardized CSS feature supported directly by modern browsers, with no compilation step required. It's syntactically similar to Sass nesting (including the `&` selector) but is parsed and applied by the browser itself at runtime.

**Q: What does a bare selector nested inside another rule mean, if `&` isn't used?**
It's implicitly treated as a descendant combinator — `.card { .title { } }` compiles to `.card .title { }`, exactly as if a space had been written between them. `&` is required when you need the nested selector to attach directly to the parent (no combinator) — e.g. `&:hover`, `&.active`, or `& + &`.

**Q: Does nesting change a selector's specificity compared to writing it flat?**
No — nesting is purely a source-authoring convenience. `.card .card__title { }` and its nested equivalent compute to the exact same specificity, (0,2,0) in that example. Careless nesting can still reintroduce the same selector-depth/specificity creep that flat, BEM-style naming is meant to avoid, if nesting is used to blindly mirror deep markup structure.

**Q: What problem does `@scope` solve that a plain descendant selector (`.card p { }`) doesn't?**
Two things: (1) it avoids having to repeat `.card` as a prefix on every single nested rule — you write `.card` once in the `@scope()` block, not on every selector inside it — and (2) it supports a lower boundary ("donut scope") via `@scope (.card) to (.nested-widget)`, excluding a nested subtree from the scope entirely. A plain descendant selector has no native way to express "apply to descendants of X, except within Y" for arbitrary nesting.

**Q: How does `@scope`-based isolation compare to CSS Modules for preventing style leakage?**
CSS Modules prevents leakage by generating globally-unique class names at build time — isolation is enforced per-file, requires a bundler, and has no concept of DOM position. `@scope` prevents leakage by DOM subtree boundary at runtime, requires no build tooling, and specifically supports excluding nested subtrees (the donut scope), which CSS Modules has no equivalent for since its isolation model isn't based on DOM structure at all.
