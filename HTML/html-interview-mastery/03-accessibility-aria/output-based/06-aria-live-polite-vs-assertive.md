***  06-aria-live-polite-vs-assertive.md ***

# Output: `aria-live="polite"` vs. `"assertive"` Timing

```html
<div aria-live="polite" id="status"></div>
<div aria-live="assertive" id="alert"></div>
```

```js
document.getElementById('status').textContent = 'Item saved.';
document.getElementById('alert').textContent = 'Connection lost.';
```

**Question:** If a screen reader is currently mid-sentence reading some unrelated page content when both of these updates happen at nearly the same moment, what's the difference in how/when each is announced?

**Answer:** The `assertive` region ("Connection lost.") **interrupts** whatever the screen reader is currently reading and is announced immediately. The `polite` region ("Item saved.") is **queued** and only announced once the screen reader finishes its current utterance and reaches a natural pause — it will never cut off in-progress speech.

**Why:** `aria-live="assertive"` (and the implicit-assertive `role="alert"`) is reserved for genuinely time-critical information the user needs right away regardless of what else is happening (errors, session timeouts, connection loss) — precisely because it's disruptive. `aria-live="polite"` (and implicit-polite `role="status"`) is for routine, non-urgent updates and is the correct default for the vast majority of dynamic status messages (save confirmations, cart counts, search-result counts) — using `assertive` for something as minor as "Item saved" would be a jarring, unnecessary interruption every time it fires, which is why over-using `assertive` is a common real-world a11y anti-pattern: it trains screen reader users to find the experience noisy and disruptive.
