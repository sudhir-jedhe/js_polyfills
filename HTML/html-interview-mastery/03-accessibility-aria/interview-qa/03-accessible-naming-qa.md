*** copy 03-accessible-naming-qa.md ***

# Interview Q&A — Accessible Naming & Screen Reader Behavior

**Q: What's the precedence order between `aria-labelledby`, `aria-label`, and a native `<label>`?**
`aria-labelledby` wins if present, overriding everything else. `aria-label` is next, overriding native labeling. A native `<label>` (or plain visible text content) is used only if neither ARIA attribute is present. `title` is the last resort, rarely relied on for accessible naming since it's also unreliable for touch/keyboard-only users.

**Q: What's a real bug that can happen if you add `aria-label` to a button that already has visible text?**
The `aria-label` value silently overrides the visible text in the accessibility tree — a `<button aria-label="Submit">Send Message</button>` shows "Send Message" on screen but announces "Submit" to a screen reader, creating a mismatch that's especially confusing for voice-control users who reference what they see on screen.

**Q: What's the difference between an element's accessible "name" and its "description"?**
The name (via `<label>`, `aria-label`, or `aria-labelledby`) identifies *what* the element is. The description (via `aria-describedby`) provides supplementary detail announced after the name — like an error message or format hint. They're distinct in the accessibility tree even though a screen reader concatenates them in announcement.

**Q: Why doesn't `opacity: 0` reliably hide text from screen readers the way `display: none` does?**
`display: none` (and `visibility: hidden`) removes an element from the accessibility tree entirely. `opacity: 0` only affects visual rendering — the element remains in both the DOM and the accessibility tree, so a screen reader can still announce content that's completely invisible on screen, creating a mismatch between what's seen and what's heard.

**Q: What's the standard technique for text that should be announced by a screen reader but not shown visually (e.g. inside an icon button)?**
A `.visually-hidden` (a.k.a. "sr-only") utility class using a specific CSS recipe — near-zero width/height, `overflow: hidden`, and `clip`-based hiding — that visually hides content while keeping it present and announced in the accessibility tree. `display: none` is not usable for this since it removes the content from AT too.

**Q: What's the difference between `aria-live="polite"` and `aria-live="assertive"`?**
`polite` queues the announcement until the screen reader finishes its current speech at a natural pause — appropriate for routine, non-urgent updates. `assertive` interrupts whatever's currently being read and announces immediately — reserved for genuinely time-critical messages (errors, session timeouts), since overusing it creates a disruptive, noisy experience.
