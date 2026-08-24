# Does This Transition Play on Initial Page Load?

```html
<div class="box">Content</div>
```

```css
.box {
  opacity: 0;
  transition: opacity 0.4s ease;
}
```

```js
document.querySelector('.box').style.opacity = '1'; // runs immediately, synchronously, on page load
```

**Question:** Does `.box` fade in smoothly over 0.4s, or does it just appear instantly at full opacity?

**Answer:** In most cases, it appears instantly, with no visible fade — the transition does not reliably play.

**Why:** A CSS transition only animates a *change* between two computed values that the browser has actually rendered/committed at two distinct points — it does not automatically animate an element's very first style application on initial render. Here, the element's `opacity: 0` (from the stylesheet) and the JS-applied `opacity: 1` both happen essentially within the same initial rendering pass, before the browser has committed a first frame showing `opacity: 0` — so there's no "previous state" for the browser to transition away from; it just paints the final `opacity: 1` state directly on first paint. This is a very common real-world bug: developers expect an "enter" animation to just work because a `transition` is declared, without realizing the element needs to actually be painted once in its *starting* state first. The standard fix is to force the initial state to be committed to a frame before toggling the class/property that triggers the transition — e.g. wrapping the change in a `requestAnimationFrame` (sometimes even a *double* `requestAnimationFrame`, since a single one isn't always sufficient in every browser/timing scenario) or applying the starting styles, then adding a class on the next frame, so the browser has genuinely rendered the "before" state before the "after" state is applied.
