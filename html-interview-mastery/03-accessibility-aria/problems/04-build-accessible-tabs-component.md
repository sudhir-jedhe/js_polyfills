# Problem: Build an Accessible Tabs Component from Scratch

## Problem Statement

Build a tabbed interface (3 tabs: "Details," "Reviews," "Shipping") following the WAI-ARIA `tablist`/`tab`/`tabpanel` pattern. Clicking a tab shows its panel and hides the others; Arrow Left/Right move between tabs (with wraparound); only the active tab is in the natural Tab order.

## Constraints

- Exactly one tab must have `tabindex="0"` at any time; all others must be `tabindex="-1"` (the "roving tabindex" pattern — Tab key moves focus *into and out of* the tablist as a whole, while Arrow keys move *within* it).
- Each panel must be correctly associated with its tab via ARIA, and be reachable in the Tab order itself if it contains focusable content.
- Arrow Left from the first tab wraps to the last, and vice versa.

## Solution

```html
<div class="tabs">
  <div role="tablist" aria-label="Product Information">
    <button role="tab" id="tab-details" aria-selected="true" aria-controls="panel-details" tabindex="0">Details</button>
    <button role="tab" id="tab-reviews" aria-selected="false" aria-controls="panel-reviews" tabindex="-1">Reviews</button>
    <button role="tab" id="tab-shipping" aria-selected="false" aria-controls="panel-shipping" tabindex="-1">Shipping</button>
  </div>

  <div role="tabpanel" id="panel-details" aria-labelledby="tab-details" tabindex="0">
    <p>Full product details…</p>
  </div>
  <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" tabindex="0" hidden>
    <p>Customer reviews…</p>
  </div>
  <div role="tabpanel" id="panel-shipping" aria-labelledby="tab-shipping" tabindex="0" hidden>
    <p>Shipping information…</p>
  </div>
</div>
```

```js
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.setAttribute('tabindex', selected ? '0' : '-1'); // roving tabindex: only the active tab is Tab-reachable
  });
  panels.forEach((p) => {
    p.hidden = p.id !== tab.getAttribute('aria-controls');
  });
  tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activateTab(tab));

  tab.addEventListener('keydown', (e) => {
    let newIndex;
    if (e.key === 'ArrowRight') newIndex = (i + 1) % tabs.length; // wrap past the end
    else if (e.key === 'ArrowLeft') newIndex = (i - 1 + tabs.length) % tabs.length; // wrap before the start
    else if (e.key === 'Home') newIndex = 0;
    else if (e.key === 'End') newIndex = tabs.length - 1;
    else return;

    e.preventDefault();
    activateTab(tabs[newIndex]);
  });
});
```

**Why this satisfies the constraints:** the "roving tabindex" pattern (only the active tab has `tabindex="0"`, the rest are `-1`) means a single Tab press moves focus *past the entire tablist* in one hop (into the active tab, or out to the next focusable thing after it), while Arrow Left/Right handle movement *within* the tablist — this exactly matches native OS tab-control conventions and is the documented WAI-ARIA pattern, not an arbitrary choice. Each `tabpanel` has `tabindex="0"` so it's independently reachable and scrollable/focusable even if it contains no other focusable content (important for panels that are just static text). `aria-controls` on each tab and `aria-labelledby` on each panel create a two-way programmatic association so assistive technology can announce "Details, tab, 1 of 3, selected" and correctly identify which tab a given panel belongs to.
