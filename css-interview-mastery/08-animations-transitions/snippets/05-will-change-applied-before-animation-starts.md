# Snippet: Applying `will-change` Just Before an Animation, and Removing It After

```html
<div class="drawer">Drawer content</div>
<button id="open-drawer">Open</button>
```

```css
.drawer {
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

.drawer.will-animate {
  will-change: transform; /* applied briefly, right before the transition actually starts */
}

.drawer.is-open {
  transform: translateX(0);
}
```

```js
const drawer = document.querySelector('.drawer');
const openBtn = document.getElementById('open-drawer');

openBtn.addEventListener('click', () => {
  drawer.classList.add('will-animate');       // hint applied just ahead of time
  requestAnimationFrame(() => {
    drawer.classList.add('is-open');           // triggers the actual transform transition
  });
});

drawer.addEventListener('transitionend', () => {
  drawer.classList.remove('will-animate');     // hint removed once the animation is done
});
```

`will-change: transform` is only present on `.drawer` for the brief window immediately before and during the slide-in transition, then removed via the `transitionend` event — this avoids permanently keeping the drawer promoted to its own compositor layer when it isn't actively animating, which would otherwise waste GPU memory for no ongoing benefit.
