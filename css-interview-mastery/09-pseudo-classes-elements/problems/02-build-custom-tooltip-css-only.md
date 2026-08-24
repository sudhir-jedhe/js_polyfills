# Problem: Build a CSS-Only Tooltip Component

## Problem Statement

Build a tooltip that appears above any element carrying a `data-tooltip` attribute, shown on both hover (mouse users) and focus (keyboard users), using generated content instead of extra markup per tooltip.

## Requirements

- Tooltip text comes from a `data-tooltip="..."` attribute — no duplicated markup per element.
- Appears on `:hover` AND `:focus-visible` (keyboard users must be able to trigger it too).
- Positioned above the trigger element, horizontally centered.
- Fades in/out rather than popping abruptly.
- Must not affect layout of surrounding content while hidden (no reserved space).

## Solution

```html
<button class="has-tooltip" data-tooltip="Save your changes">Save</button>
<a class="has-tooltip" data-tooltip="Opens in a new tab" href="#" target="_blank">Docs</a>
```

```css
.has-tooltip {
  position: relative;
}

.has-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #111827;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}

/* small arrow */
.has-tooltip::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 3px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #111827;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, visibility 0.15s;
}

.has-tooltip:hover::after,
.has-tooltip:hover::before,
.has-tooltip:focus-visible::after,
.has-tooltip:focus-visible::before {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
```

**Why this works:** `attr(data-tooltip)` pulls the label directly from markup, so one CSS rule serves every tooltip trigger regardless of text. `position: absolute` on the pseudo-elements removes them from normal flow, so they never affect layout even before `visibility`/`opacity` toggle them visible — this is why `visibility: hidden` is paired with `opacity: 0` rather than `display: none`: `display: none` can't be transitioned (no intermediate frames), while `visibility` can be, giving a smooth fade. Binding the visible state to both `:hover` and `:focus-visible` (not just `:hover`) ensures keyboard users tabbing to the trigger see the same tooltip mouse users get.

**Known limitation:** pure-CSS tooltips built this way are decorative for sighted users but aren't announced to screen readers as a tooltip relationship — for a fully accessible tooltip, pair this visual treatment with `aria-describedby` pointing at a (possibly visually-hidden) real element containing the same text.
