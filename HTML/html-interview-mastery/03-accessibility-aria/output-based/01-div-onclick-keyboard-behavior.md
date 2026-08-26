*** copy 01-div-onclick-keyboard-behavior.md ***

# Output: `<div onclick>` and Keyboard Behavior

```html
<div onclick="alert('Clicked!')" style="cursor:pointer; padding:10px; background:#eee;">
  Click me
</div>
```

**Question:** A sighted mouse user clicks it and sees the alert. A keyboard-only user tabs through the page. What happens when they reach this element and press Enter?

**Answer:** Nothing — the keyboard user's Tab key **skips this element entirely**; it never receives focus, because plain `<div>`s are not part of the default tab order regardless of any `onclick` handler or CSS `cursor: pointer` styling. There's no "reaching for it and pressing Enter" scenario at all — from a keyboard user's perspective, this control simply does not exist on the page.

**Why:** Focusability in HTML is determined by the element type (form controls, `<a href>`, `<button>` are focusable by default) or an explicit `tabindex` attribute — CSS styling (`cursor: pointer`) and JS event handlers (`onclick`) have zero effect on the accessibility tree or tab order. This is precisely why `<div onclick>` "buttons" are one of the most commonly cited real-world accessibility bugs: they work perfectly for mouse users and are completely invisible/unusable for keyboard-only and most screen reader users, who navigate primarily via Tab and rely on the focus order to discover interactive elements.
