*** copy 02-accessible-custom-dropdown-combobox.md ***

# Scenario: Building an Accessible Custom Dropdown (Combobox)

**Scenario:** Design requires a heavily custom-styled "Select a country" dropdown that a native `<select>` can't achieve visually (rich option rendering with flags, custom scrollbar styling, grouped headers). Build it to be genuinely keyboard- and screen-reader-accessible, following the WAI-ARIA `listbox` pattern.

**Approach:**

```html
<label id="country-label" for="country-button">Country</label>
<button id="country-button" aria-haspopup="listbox" aria-expanded="false"
        aria-labelledby="country-label country-button">
  Select a country
</button>
<ul id="country-listbox" role="listbox" aria-labelledby="country-label" hidden tabindex="-1">
  <li role="option" id="opt-us" aria-selected="false" tabindex="-1">🇺🇸 United States</li>
  <li role="option" id="opt-ca" aria-selected="false" tabindex="-1">🇨🇦 Canada</li>
  <li role="option" id="opt-uk" aria-selected="false" tabindex="-1">🇬🇧 United Kingdom</li>
</ul>
```

```js
const button = document.getElementById('country-button');
const listbox = document.getElementById('country-listbox');
const options = [...listbox.querySelectorAll('[role="option"]')];
let activeIndex = -1;

function openListbox() {
  listbox.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  activeIndex = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
  if (activeIndex === -1) activeIndex = 0;
  focusOption(activeIndex);
  document.addEventListener('click', onOutsideClick);
}

function closeListbox() {
  listbox.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  button.focus(); // return focus to the trigger, same principle as the modal scenario
  document.removeEventListener('click', onOutsideClick);
}

function focusOption(index) {
  options.forEach(o => o.setAttribute('tabindex', '-1'));
  const opt = options[index];
  opt.setAttribute('tabindex', '0');
  opt.focus();
  listbox.setAttribute('aria-activedescendant', opt.id); // announces which option is "active" while focus stays on the listbox
  activeIndex = index;
}

function selectOption(index) {
  options.forEach(o => o.setAttribute('aria-selected', 'false'));
  options[index].setAttribute('aria-selected', 'true');
  button.textContent = options[index].textContent;
  closeListbox();
}

button.addEventListener('click', () => (listbox.hidden ? openListbox() : closeListbox()));

listbox.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); focusOption(Math.min(activeIndex + 1, options.length - 1)); break;
    case 'ArrowUp':   e.preventDefault(); focusOption(Math.max(activeIndex - 1, 0)); break;
    case 'Enter':
    case ' ':         e.preventDefault(); selectOption(activeIndex); break;
    case 'Escape':    e.preventDefault(); closeListbox(); break;
    case 'Home':      e.preventDefault(); focusOption(0); break;
    case 'End':       e.preventDefault(); focusOption(options.length - 1); break;
  }
});

function onOutsideClick(e) {
  if (!listbox.contains(e.target) && e.target !== button) closeListbox();
}
```

**Why each piece exists:**
- `aria-haspopup="listbox"` + `aria-expanded` on the trigger button announces "has popup, collapsed/expanded," so a screen reader user knows this button opens a list, not just performs an action.
- `role="listbox"`/`role="option"` gives the custom `<ul>`/`<li>` structure the correct semantics a native `<select>` would have automatically.
- Arrow-key navigation, `Home`/`End`, `Enter`/`Space` to select, and `Escape` to close all mirror the exact keyboard interaction users already expect from a native `<select>` — this is the WAI-ARIA Authoring Practices' documented pattern, not an invented one, which matters because deviating from documented patterns is a common source of subtly-wrong-feeling custom widgets.
- `aria-activedescendant` lets focus conceptually stay on the `listbox` container while visually/programmatically indicating which option is "current" — an alternative to physically moving DOM focus to each `<li>`, useful when you want the button/input to retain real focus the whole time (more common in true combobox/typeahead patterns).
- Closing on outside click and returning focus to the trigger button on close mirror standard native `<select>`/modal-adjacent conventions users already rely on.

**Bottom line:** this is a lot of code to replace something `<select>` gives for free — which is exactly why the "no ARIA is better than bad ARIA" and "prefer native elements" rules exist. This build is only justified when the visual requirements are genuinely impossible with a styled native `<select>`.
