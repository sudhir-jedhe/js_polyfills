# Problem: Build an Accordion with a Smooth, Non-Janky Height Transition

## Problem Statement

Build an accordion component (expandable/collapsible content panels) where each panel smoothly animates open/closed, correctly handles arbitrary/dynamic content height (not a fixed guess), and avoids the common Layout-cost jank of naive `height`/`max-height` approaches as much as CSS-only techniques reasonably allow.

## Requirements

- Multiple accordion items, each with a header (click to toggle) and a content panel.
- Smooth open/close animation, not an instant snap.
- Works correctly for panels of genuinely different, dynamic content heights (not a shared fixed pixel value).
- Icon (e.g. a chevron) rotates to indicate open/closed state, animated with a cheap, compositor-friendly property.
- Keyboard accessible (`button` trigger, `aria-expanded` reflects state).

## Approach

Use the measured-`scrollHeight` + `requestAnimationFrame` technique (rather than a fixed `max-height` guess) so the animation duration always corresponds to the panel's actual real content height, avoiding the "animating through a lot of empty overshoot space" problem a generic large `max-height` would cause. The chevron icon rotation is a pure `transform`, entirely decoupled from the height animation's cost.

## Solution

```html
<div class="accordion-item">
  <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-1">
    Section title
    <span class="chevron">▾</span>
  </button>
  <div id="panel-1" class="accordion-panel" role="region">
    <div class="accordion-panel-inner">
      <p>Arbitrary content of any length goes here...</p>
    </div>
  </div>
</div>
```

```css
.accordion-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
}

.chevron {
  transform: rotate(0deg);
  transition: transform 0.2s ease; /* cheap — compositor-only */
}
.accordion-trigger[aria-expanded='true'] .chevron {
  transform: rotate(180deg);
}

.accordion-panel {
  height: 0;
  overflow: hidden;
  transition: height 0.25s ease;
}

.accordion-panel-inner {
  padding: 0 16px 16px; /* padding lives on the INNER element, not the animated panel itself,
                            so it doesn't distort the measured scrollHeight calculation */
}
```

```js
document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));

    if (isOpen) {
      // Closing: measure current height explicitly first (in case it's "auto"-like from
      // a prior open state), then transition down to 0 on the next frame.
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        panel.style.height = '0px';
      });
    } else {
      // Opening: transition from 0 up to the real measured content height.
      panel.style.height = `${panel.scrollHeight}px`;
      panel.addEventListener(
        'transitionend',
        () => {
          if (trigger.getAttribute('aria-expanded') === 'true') {
            panel.style.height = 'auto'; // allow natural resizing (e.g. window resize, dynamic content)
          }
        },
        { once: true }
      );
    }

    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});
```

**Why `height: auto` is set after the opening transition finishes, rather than left as a fixed pixel value permanently:** locking the panel to a fixed pixel height after opening would break if the content's natural height changes afterward (e.g. a window resize reflowing text to a different number of lines, or dynamically loaded content). Setting it to `auto` post-transition restores natural, responsive sizing — but `auto` can't be the *animated* value itself (transitions can't interpolate to/from `auto`), which is exactly why the animation always targets a specific measured pixel value, and `auto` is only applied afterward, once the transition has already completed.

**Why padding lives on `.accordion-panel-inner`, not `.accordion-panel` directly:** if the animated element itself had padding, `scrollHeight` measurements and the `0` collapsed state would need to separately account for that padding to avoid a persistent gap when "closed" — keeping padding on a nested wrapper keeps the outer, animated element's height cleanly ranging from a true `0` to the full content height, with no extra arithmetic needed.
