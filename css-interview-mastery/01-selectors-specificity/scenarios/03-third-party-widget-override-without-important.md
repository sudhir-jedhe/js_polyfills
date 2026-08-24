# Scenario: Overriding a Third-Party Widget Without `!important`

**Scenario:** You've embedded a third-party chat widget that ships its own CSS with rules like `.chat-widget .chat-widget__button { background: #00c; }` (specificity (0,2,0)), loaded via a `<link>` in your `<head>` *after* your own app CSS. Design wants the button to match your brand color. Editing the vendor's CSS file is not an option (it's fetched from their CDN and could change any release). How do you override it cleanly, without resorting to `!important`?

**Approach — you have two clean options, in order of preference:**

**Option 1: Cascade layers, explicitly de-prioritizing the vendor CSS.** If you control how the vendor stylesheet is loaded (e.g. via `@import`), wrap it in a named layer, and put your override in a layer declared later:
```css
@layer vendor, app-overrides;
@import url("chat-widget.css") layer(vendor);

@layer app-overrides {
  .chat-widget__button { background: var(--brand-color); } /* wins regardless of the vendor's specificity */
}
```
This is the most robust option: it doesn't matter how specific the vendor's selectors are or how they change release to release — `app-overrides` being a later layer guarantees your rule wins for any property both stylesheets touch.

**Option 2: If you can't control the `<link>`/layer of the vendor file (e.g. it's injected by a `<script>` tag you don't own), match or exceed specificity instead** — figure out the vendor's actual specificity via DevTools, then write a selector at least that strong, placed after their stylesheet in the DOM/load order:
```css
.chat-widget .chat-widget__button { background: var(--brand-color); } /* same (0,2,0), later in source order → wins */
```
If the vendor rule is `(0,2,0)` you only need to *match* it (not exceed it) as long as your `<link>`/`<style>` loads after theirs, since equal specificity falls back to source order. Only reach for a third class-selector or `!important` if the vendor also ships an `!important` on that property (check first — most third-party widgets don't).

**Why not just use `!important`:** it works, but it's brittle — the next time the vendor bumps their widget version and adds their own `!important` (a real, common occurrence, since vendors sometimes go through the exact same escalation described in the other scenarios), you're back to square one with no clean escalation path left except an even more specific `!important`, which is a losing long-term strategy.
