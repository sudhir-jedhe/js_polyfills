# Scenario: A CSS-Only Custom Checkbox

**Situation:** Design wants a custom-styled checkbox (rounded box, checkmark icon, brand color when checked) but the native checkbox is nearly impossible to restyle directly, and the team wants to avoid JavaScript for something this simple.

**Approach:**

```html
<label class="checkbox">
  <input type="checkbox" />
  <span class="box"></span>
  Subscribe to updates
</label>
```

```css
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* Hide the native control visually but keep it in the accessibility tree and focusable */
.checkbox input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.box {
  width: 20px;
  height: 20px;
  border: 2px solid #999;
  border-radius: 4px;
  display: inline-block;
  position: relative;
}

/* :checked is a pseudo-class on the (hidden) input; style its SIBLING via the general sibling combinator */
.checkbox input:checked ~ .box {
  background: #2563eb;
  border-color: #2563eb;
}

.checkbox input:checked ~ .box::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Keep keyboard focus visible on the custom box, not just the (invisible) input */
.checkbox input:focus-visible ~ .box {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

**Why this works:** the real `<input type="checkbox">` stays in the DOM and keeps native keyboard/screen-reader behavior — it's only visually hidden (never `display: none`, which would remove it from the accessibility tree and break Tab navigation). The `:checked` pseudo-class combined with the `~` sibling combinator lets the checkmark box react purely to the real input's state, and `::after` draws the checkmark glyph without any extra markup. `:focus-visible` on the hidden input still needs to visibly show up somewhere, so it's forwarded onto the visible `.box` sibling.
