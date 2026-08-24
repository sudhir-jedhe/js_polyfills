# `<iframe>`: Sandboxing and Security Considerations

## Why `<iframe>` needs careful security treatment

An `<iframe>` embeds an entire separate browsing context — potentially loading content from a completely different, untrusted origin (a third-party widget, an ad, user-generated embed content). Without restriction, that embedded page can, by default, run scripts, submit forms, open popups, and (same-origin permitting) interact with the parent page — a significant attack surface if the embedded content isn't fully trusted.

## The `sandbox` attribute

```html
<iframe src="https://untrusted-widget.example.com/embed" sandbox></iframe>
```

An empty `sandbox` attribute applies the **maximum restriction**: no scripts, no form submission, no same-origin access (the iframe is treated as coming from a unique, opaque origin regardless of its actual URL), no popups, no top-level navigation, no plugins. You then **selectively re-enable** only what's actually needed via space-separated tokens:

| Token | Re-enables |
|---|---|
| `allow-scripts` | JavaScript execution inside the iframe |
| `allow-same-origin` | Treats the iframe as its actual origin (needed for the embedded page's own cookies/storage/APIs to work) |
| `allow-forms` | Form submission from within the iframe |
| `allow-popups` | `window.open()` and links with `target="_blank"` from within the iframe |
| `allow-top-navigation` | Allows the iframe to navigate the *parent* page — rarely appropriate for untrusted content |
| `allow-modals` | `alert()`/`confirm()`/`prompt()` from within the iframe |
| `allow-downloads` | Triggering file downloads from within the iframe |

```html
<!-- Common real-world case: an embedded interactive widget that needs to run its own JS -->
<iframe src="https://widget.example.com/embed" sandbox="allow-scripts allow-forms"></iframe>
```

## The dangerous combination: `allow-scripts` + `allow-same-origin` together

```html
<!-- CAUTION: this combination effectively cancels out most of sandbox's protection -->
<iframe src="https://third-party.example.com" sandbox="allow-scripts allow-same-origin"></iframe>
```

If a sandboxed iframe has **both** `allow-scripts` and `allow-same-origin`, the embedded page's script can use JavaScript to *remove its own sandbox attribute* (since it now has same-origin access to manipulate its own frame element via the parent-accessible DOM, in same-origin scenarios) — effectively defeating the sandbox. Security guidance is explicit about this: never grant both to genuinely untrusted content simultaneously; if the embedded content needs to actually execute scripts *and* needs real origin/storage access, it needs to be trusted content in the first place, not sandboxed at all.

## `allow` attribute — Permissions Policy for iframes

Separate from `sandbox`, the `allow` attribute controls access to powerful browser features (camera, microphone, geolocation, fullscreen) for the embedded content:

```html
<iframe
  src="https://meet.example.com/room/123"
  allow="camera; microphone; fullscreen"
  sandbox="allow-scripts allow-same-origin allow-forms">
</iframe>
```

Without explicitly allowing a feature here, the embedded iframe cannot access it even if the user would otherwise grant permission — this is a deliberate host-page-controlled allowlist, not something the embedded page can bypass on its own.

## `referrerpolicy` and `loading`

```html
<iframe src="https://ads.example.com/slot" referrerpolicy="no-referrer" loading="lazy"></iframe>
```

`referrerpolicy="no-referrer"` prevents your page's URL from being leaked to the embedded third party via the `Referer` header — relevant when embedding ads/trackers you don't want learning which of your pages the user was on. `loading="lazy"` works on iframes the same way it does on images, deferring offscreen iframe loads (very relevant for pages with many embedded widgets/ads).

## X-Frame-Options / CSP `frame-ancestors` — the other side of the coin

These are response headers set by the page *being embedded*, not attributes on the `<iframe>` itself, but they're the natural counterpart: they let a site refuse to be embedded in someone else's iframe at all (preventing clickjacking attacks where your legitimate page is embedded invisibly inside a malicious page). This is worth mentioning in an interview to show awareness that iframe security is a two-way concern — both what you allow content to do when embedding it, and what you allow to be done when your own content gets embedded elsewhere.
