***  03-build-secure-iframe-embed-with-sandbox.md ***

# Problem: Build a Securely Sandboxed Iframe Embed

## Problem Statement

Your product allows users to embed a third-party "customer review widget" (an untrusted, arbitrary URL a customer configures themselves) on their storefront page. The widget needs to: run its own JavaScript, submit a review form, and open a "read more on [platform]" link in a new tab. It should NOT be able to navigate your parent page, access your page's cookies/storage, or use camera/microphone/geolocation.

## Constraints

- Grant the minimum sandbox tokens necessary for the three stated required behaviors — no more.
- Explicitly deny access to any powerful browser features via `allow`.
- Include a proper accessible `title`.
- Explain, in a comment, why any dangerous-looking token combination is (or isn't) present.

## Solution

```html
<iframe
  src="https://untrusted-widget-vendor.example.com/embed?store=acme-store"
  title="Customer review widget"
  width="100%" height="400"
  sandbox="allow-scripts allow-forms allow-popups"
  allow=""
  referrerpolicy="no-referrer"
  loading="lazy">
</iframe>
```

**Token-by-token justification:**

- `allow-scripts` — required for the widget's own JS to run at all (stated requirement: "run its own JavaScript").
- `allow-forms` — required for review form submission (stated requirement).
- `allow-popups` — required for the "read more" link to open in a new tab via `target="_blank"` (stated requirement).
- **Deliberately NOT included: `allow-same-origin`.** The widget doesn't need access to your page's actual origin/cookies/storage for any of the three stated behaviors, and — critically — combining `allow-same-origin` with `allow-scripts` would let the widget's own JS strip its sandbox restrictions entirely. Since it's not needed here, omitting it keeps the sandbox's protection fully intact.
- **Deliberately NOT included: `allow-top-navigation`.** This directly satisfies "should NOT be able to navigate your parent page" — without this token, the iframe cannot redirect or replace the parent document's location under any circumstance.
- `allow=""` (empty Permissions Policy) explicitly denies camera/microphone/geolocation and every other powerful feature — satisfying "should NOT be able to use camera/microphone/geolocation" as a positive, explicit denial rather than relying on an assumed default.
- `referrerpolicy="no-referrer"` prevents your storefront's URL (and any query parameters, like `store=acme-store` used only for internal routing) from leaking to the third-party vendor's server logs/analytics.
- `title="Customer review widget"` gives the iframe an accessible name for screen reader users, since an iframe has no other inherent way to convey its purpose.
- `loading="lazy"` defers this (likely below-the-fold, third-party-hosted, and therefore comparatively slow) embed until it's actually needed, protecting the rest of the storefront page's load performance from this unpredictable third-party dependency.
