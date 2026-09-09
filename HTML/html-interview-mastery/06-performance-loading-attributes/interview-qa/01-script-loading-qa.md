***  01-script-loading-qa.md ***

# Interview Q&A — Script Loading

**Q: What's the exact execution-order difference between `defer` and `async`?**
`defer` scripts always execute in document order, only after HTML parsing has fully completed, and always before `DOMContentLoaded`. `async` scripts execute as soon as their individual download finishes, in whatever order that happens to be — potentially interrupting parsing mid-way, and with no guaranteed relationship to document order or to other `async` scripts.

**Q: Does a plain `<script src>` (no attribute) block HTML parsing?**
Yes — the parser stops entirely, fetches the script (unless cached), then executes it synchronously, and only resumes parsing the rest of the document after execution finishes.

**Q: If you have two scripts where one depends on the other (e.g., a framework and code that uses it), should you use `async` or `defer`?**
`defer` — it guarantees both scripts execute in document order, so the dependency (framework loaded first) is always satisfied. `async` gives no such guarantee; both scripts execute independently as soon as each one's download finishes, which can easily result in the dependent script running before its dependency, especially under varying network conditions.

**Q: Does `defer` fire before or after `DOMContentLoaded`?**
Always before — in fact, all deferred scripts finishing execution, in order, is one of the conditions that triggers `DOMContentLoaded` to fire.

**Q: How does `type="module"` affect script loading by default?**
Module scripts are deferred automatically — fetched without blocking parsing, executed in document order, after parsing completes, before `DOMContentLoaded` — without needing an explicit `defer` attribute. Adding `async` to a module script opts it into `async`-style unordered, as-soon-as-ready execution instead.

**Q: Why would you deliberately choose a plain, blocking `<script>` over `defer`/`async`?**
Rarely, but sometimes intentionally — a small inline script that must run at an exact point in the parsing sequence to avoid a visible flash (e.g., setting a `dark-mode` class on `<html>` before any content paints, so there's no flash of the wrong theme). This only makes sense for tiny inline scripts where the blocking cost is negligible; for external files, it's almost never the right choice.

**Q: What's the relationship between `DOMContentLoaded` and the `load` event?**
`DOMContentLoaded` fires once HTML parsing (and all deferred scripts) are done — it doesn't wait for images, stylesheets beyond what's needed for CSSOM, or other subresources. `load` fires much later, once every resource referenced by the page has fully finished loading.
