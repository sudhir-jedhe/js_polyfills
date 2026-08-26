*** copy 02-async-breaks-jquery-dependent-script.md ***

# Scenario: Switching to `async` Broke a jQuery-Dependent Script

**Scenario:** A junior developer, trying to speed up the site, added `async` to every `<script>` tag in `<head>`, including `jquery.js` and `app.js` (which calls `$(document).ready(...)` and uses `$` extensively). After deploying, the site intermittently throws `Uncaught ReferenceError: $ is not defined` in production — but it works fine locally, every time. What's happening, and how do you fix it?

**Diagnosis:** `app.js` depends on `jquery.js` having already executed and defined the global `$`. With `async` on both scripts, there is **no guaranteed execution order** — each script executes as soon as its own download finishes, independent of the other. Locally, `jquery.js` (served from disk or a fast local cache) likely always finishes downloading before the much smaller `app.js`, so the bug never reproduces. In production, over a real network, timing is far less predictable — sometimes `app.js` (perhaps served from a faster CDN edge, or simply smaller) finishes downloading and executes **before** `jquery.js` has, hitting `$` before it exists. This is precisely the trap `async` sets for scripts with dependencies: it looks like it works because it usually does, until network timing shifts the odds.

**Fix — switch both to `defer` instead:**

```html
<script src="jquery.js" defer></script>
<script src="app.js" defer></script>
```

`defer` guarantees both (a) execution happens only after parsing completes, and (b) execution order matches document order exactly, every single time, regardless of which file finishes downloading first. `jquery.js` is now guaranteed to run before `app.js`, deterministically, on every page load, on every network condition — eliminating the intermittent bug entirely rather than just making it statistically less likely.

**Why not just add a manual check inside `app.js` instead (e.g., polling for `window.$`)?** That papers over a race condition with more complexity (polling loops, retries, timeouts) instead of just using the loading attribute that already provides the deterministic guarantee needed. `defer` is the correct fix because the actual requirement — "these scripts must run in this exact order, after the DOM is ready" — is precisely what `defer` is designed to guarantee, with zero extra code.

**Takeaway for the team:** `async` should be reserved specifically for scripts with **no dependency** on other scripts or on the DOM (independent third-party widgets, analytics). Any script with an ordering dependency — including something as common as "framework must load before the code that uses it" — belongs on `defer`, never `async`.
