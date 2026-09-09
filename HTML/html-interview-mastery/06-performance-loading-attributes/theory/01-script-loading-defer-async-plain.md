***  01-script-loading-defer-async-plain.md ***

# Script Loading: Plain `<script>` vs `async` vs `defer`

This is the single most commonly asked HTML performance question, and interviewers specifically probe for **exact execution order**, not just a vague "async loads in the background" answer. Getting the fetch-vs-parse-vs-execute timing precisely right is what separates a surface-level answer from a strong one.

## The three variants

```html
<script src="a.js"></script>
<script src="b.js" async></script>
<script src="c.js" defer></script>
```

## What HTML parsing does at each

| | Plain `<script src>` | `async` | `defer` |
|---|---|---|---|
| **Fetching** | Blocks parsing to fetch (unless already cached) | Fetched in parallel, parsing continues | Fetched in parallel, parsing continues |
| **Execution timing** | Immediately after fetch — **blocks parsing** while it runs | As soon as the script finishes downloading — **may interrupt parsing** whenever that happens | After parsing completes, before `DOMContentLoaded` |
| **Execution order (multiple scripts)** | Strict document order (each blocks the next) | **Arbitrary** — whichever finishes downloading first runs first | Strict document order, always |
| **Guaranteed DOM available at execution?** | Only DOM parsed so far (elements below the script tag don't exist yet) | Only DOM parsed so far — unreliable, since it can fire at any point | **Full DOM** — parsing has already finished |
| **Fires relative to `DOMContentLoaded`** | Before (parsing was blocked until the script ran) | Usually before, but not guaranteed — can even fire after, if the fetch is slow | Always before `DOMContentLoaded`, in document order |

## Precise timeline for a plain (blocking) script

```html
<p>Before</p>
<script src="a.js"></script>
<p>After</p>
```

1. Parser reaches `<script src="a.js">`.
2. Parser **stops** — fetches `a.js` (network round trip, unless cached).
3. Once fetched, parser **stops again** — executes `a.js` synchronously.
4. Only after execution finishes does parsing resume with `<p>After</p>`.

This is why render-blocking `<script>` tags in `<head>` (without `defer`/`async`) delay first paint — the browser can't even finish building the DOM, let alone paint, until the script has downloaded *and* run.

## Precise timeline for `async`

```html
<script src="a.js" async></script>
<script src="b.js" async></script>
```

1. Parser reaches the `async` scripts, kicks off their fetches, and **keeps parsing the rest of the document** without waiting.
2. Whichever script (`a.js` or `b.js`) finishes downloading **first** is executed **immediately** — pausing parsing at whatever point the parser happens to be at that moment — regardless of source order.
3. The other script executes the same way whenever *it* finishes downloading.

**Key trap:** if `b.js` is smaller/faster to download than `a.js`, `b.js` executes **before** `a.js`, even though `a.js` appears first in the HTML. `async` scripts must not depend on each other's execution order, and must not assume the full DOM is available (since they can fire mid-parse).

## Precise timeline for `defer`

```html
<script src="a.js" defer></script>
<script src="b.js" defer></script>
```

1. Both fetches start in parallel while parsing continues, same as `async`.
2. **Neither executes until HTML parsing is completely finished.**
3. At that point, they execute **in document order** — `a.js` always before `b.js`, regardless of which one finished downloading first.
4. All `defer` scripts finish executing **before** the `DOMContentLoaded` event fires.

This makes `defer` the safe default for most application scripts: full DOM is guaranteed available, and multiple deferred scripts execute in a predictable order, so `a.js` can safely define something `b.js` depends on.

## Quick decision guide

- **Plain `<script>`** (no attribute): almost never what you want for external scripts in `<head>` — blocks parsing and rendering. Acceptable for small inline scripts that must run at an exact point in the document (e.g., a tiny snippet setting a class before any content renders, to avoid a flash).
- **`async`**: independent scripts with no DOM dependency and no dependency on other scripts — analytics snippets, ad tags, third-party widgets that don't interact with your page's own code.
- **`defer`**: your own application scripts, especially when there are multiple files with dependencies between them, or when they need to safely query the full DOM.

## `type="module"` behaves like `defer` by default

`<script type="module">` is deferred **automatically**, without needing the `defer` attribute — module scripts execute after parsing, in document order, before `DOMContentLoaded`, matching `defer`'s semantics. Adding `async` to a module script opts it back into `async`-style out-of-order, as-soon-as-ready execution.
