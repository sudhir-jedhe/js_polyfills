*** copy 02-embedding-third-party-video-securely.md ***

# Scenario: Embedding a Third-Party Video Player Securely

**Scenario:** Marketing wants to embed a YouTube video on the homepage. A security review asks: what's the actual risk of embedding third-party video, and what should the embed code look like to minimize it while keeping the video fully functional (play, fullscreen, no console errors)?

**Diagnosis:** An `<iframe>` embed of a third-party video player runs the third party's own JavaScript inside your page's frame — while you're not directly executing untrusted code in your own page's context (the iframe is a separate browsing context, which is the whole point), it can still open popups, request fullscreen, or (if same-origin/allow-same-origin conditions were mismanaged) probe for more access than intended. For a well-known, generally-trusted vendor like YouTube, the goal isn't "sandbox it into uselessness" — it's applying the **minimum necessary permission set**, deliberately, rather than accepting whatever an unreviewed embed snippet copy-pasted from a "share" button happens to include.

**Fix:**

```html
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="Product demo video"
  width="800" height="450"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
  referrerpolicy="strict-origin-when-cross-origin"
  loading="lazy">
</iframe>
```

**Key decisions:**
- **`youtube-nocookie.com`** instead of `youtube.com` — YouTube's own privacy-enhanced embed domain, which avoids setting tracking cookies until the user actually interacts with the player, reducing the privacy footprint of the embed without breaking functionality.
- **`allow="..."`** lists only the specific features the player actually needs (autoplay support, fullscreen-adjacent APIs, picture-in-picture) rather than a blanket grant — this list matches YouTube's own documented embed requirements, not an arbitrary broad allowlist.
- **No explicit `sandbox` attribute here** — deliberately. YouTube's player genuinely needs `allow-scripts`, `allow-same-origin`, `allow-popups` (for share/login flows), and `allow-presentation` to function correctly; sandboxing it to the point of requiring all of these effectively provides no real additional protection over not sandboxing at all, while adding a maintenance burden of tracking every token the player needs across YouTube's own updates. Sandbox is most valuable for content where you can meaningfully restrict *without* breaking core functionality — for a full-featured, well-known video platform, `allow`'s scoped feature permissions do more useful work than an all-or-nothing sandbox token list.
- **`referrerpolicy="strict-origin-when-cross-origin"`** (the modern browser default, set explicitly for clarity) avoids leaking full page URLs (e.g. containing query parameters) to the third party while still sending the origin, which is enough for most legitimate analytics use without over-sharing.
- **`loading="lazy"`** — a homepage rarely needs the video to load instantly if it's below an initial fold; deferring it avoids competing for bandwidth with the actual above-the-fold content on page load.

**The general lesson for the interview:** "add `sandbox`" isn't automatically the more secure answer for every third-party embed — the right call depends on how much you trust the vendor and whether restriction is even compatible with the required functionality; the actually security-conscious habit is deliberately reviewing and minimizing the `allow`/`sandbox`/`referrerpolicy` attributes on every embed rather than blindly pasting a vendor's default snippet.
