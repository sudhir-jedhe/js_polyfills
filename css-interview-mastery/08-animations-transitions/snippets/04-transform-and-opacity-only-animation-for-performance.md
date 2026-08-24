# Snippet: A Modal Entrance Animated Using Only Compositor-Cheap Properties

```html
<div class="modal-overlay">
  <div class="modal">Modal content</div>
</div>
```

```css
.modal-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.modal-overlay.is-open {
  opacity: 1;
}

.modal {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}
.modal-overlay.is-open .modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}
```

Every animated property here — `opacity` and `transform` (`translateY`/`scale`) — is compositor-eligible, meaning the browser can run the entire entrance animation on the compositor thread without triggering Layout or Paint on any frame. Notice `translateY(16px)` is used instead of animating `top`/`margin-top` to achieve the same "slides up slightly" visual effect — a `transform`-based translation produces an equivalent look to a `top`/`margin` change but at a fraction of the performance cost, since it never touches the element's actual layout geometry.
