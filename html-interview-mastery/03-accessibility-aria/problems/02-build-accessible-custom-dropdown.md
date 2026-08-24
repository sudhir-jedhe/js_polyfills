# Problem: Build an Accessible Custom Dropdown (Listbox Pattern) from Scratch

## Problem Statement

Build a single-select custom dropdown for choosing a priority level (Low / Medium / High / Urgent) that behaves like a native `<select>` for keyboard and screen reader users, but allows full custom visual styling of the options (native `<select>` popups can't be styled per-option in most browsers).

## Constraints

- Trigger button announces expanded/collapsed state and that it has a popup.
- Arrow Up/Down moves through options; Home/End jump to first/last; Enter/Space selects; Escape closes without changing selection.
- The currently selected option must be visually and programmatically indicated.
- Clicking outside closes the dropdown without changing the selection.

## Solution

```html
<label id="priority-label" for="priority-btn">Priority</label>
<button id="priority-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="priority-label priority-btn">
  Medium
</button>
<ul id="priority-listbox" role="listbox" aria-labelledby="priority-label" hidden>
  <li role="option" data-value="low" tabindex="-1">Low</li>
  <li role="option" data-value="medium" aria-selected="true" tabindex="0">Medium</li>
  <li role="option" data-value="high" tabindex="-1">High</li>
  <li role="option" data-value="urgent" tabindex="-1">Urgent</li>
</ul>
```

```js
const btn = document.getElementById('priority-btn');
const listbox = document.getElementById('priority-listbox');
const options = [...listbox.querySelectorAll('[role="option"]')];
let activeIndex = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
let preOpenSelection = activeIndex;

function open() {
  preOpenSelection = activeIndex; // remember, so Escape can revert cleanly
  listbox.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  focusOption(activeIndex);
  document.addEventListener('click', onOutsideClick, true);
}

function close(cancelled = false) {
  if (cancelled) selectOption(preOpenSelection, { silent: true });
  listbox.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  btn.focus();
  document.removeEventListener('click', onOutsideClick, true);
}

function focusOption(index) {
  options.forEach(o => o.setAttribute('tabindex', '-1'));
  options[index].setAttribute('tabindex', '0');
  options[index].focus();
  activeIndex = index;
}

function selectOption(index, { silent = false } = {}) {
  options.forEach(o => o.setAttribute('aria-selected', 'false'));
  options[index].setAttribute('aria-selected', 'true');
  activeIndex = index;
  if (!silent) {
    btn.textContent = options[index].textContent;
    close();
  }
}

btn.addEventListener('click', () => (listbox.hidden ? open() : close()));

listbox.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); focusOption(Math.min(activeIndex + 1, options.length - 1)); break;
    case 'ArrowUp':   e.preventDefault(); focusOption(Math.max(activeIndex - 1, 0)); break;
    case 'Home':      e.preventDefault(); focusOption(0); break;
    case 'End':       e.preventDefault(); focusOption(options.length - 1); break;
    case 'Enter':
    case ' ':         e.preventDefault(); selectOption(activeIndex); btn.textContent = options[activeIndex].textContent; close(); break;
    case 'Escape':    e.preventDefault(); close(true); break;
  }
});

function onOutsideClick(e) {
  if (!listbox.contains(e.target) && e.target !== btn) close(true);
}
```

**Why this satisfies the constraints:** `aria-haspopup="listbox"` + `aria-expanded` on the trigger fully announces the control's nature and state. Arrow/Home/End/Enter/Space/Escape all follow the documented WAI-ARIA listbox keyboard pattern rather than an invented scheme. `aria-selected="true"` on the current option provides the programmatic "currently selected" signal (paired with CSS styling keyed off the same attribute for the visual indication, keeping the two in sync from one source of truth). `close(true)` on both `Escape` and outside-click reverts to `preOpenSelection`, ensuring neither action changes the actual selection — mirroring how a native `<select>` popup behaves when dismissed without choosing an option.
