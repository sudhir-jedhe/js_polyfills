# Snippet: Sandboxed `<iframe>` Embed

```html
<!-- Untrusted third-party widget: maximum restriction, only re-enable what's needed -->
<iframe
  src="https://widget.example.com/embed/123"
  sandbox="allow-scripts allow-forms"
  referrerpolicy="no-referrer"
  loading="lazy"
  title="Customer feedback widget"
  width="400" height="300">
</iframe>
```

```html
<!-- Trusted video embed needing camera/mic/fullscreen access (e.g. a video call widget) -->
<iframe
  src="https://meet.example.com/room/abc"
  allow="camera; microphone; fullscreen; display-capture"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  title="Video call">
</iframe>
```

Every `<iframe>` should have a `title` attribute — it's the accessible name announced to screen readers identifying what the embedded frame contains, since there's no visible "label" for an iframe the way there is for a form field. The first example deliberately omits `allow-same-origin` (an untrusted widget doesn't need it, and combining it with `allow-scripts` would let the embedded page strip its own sandbox restrictions).
