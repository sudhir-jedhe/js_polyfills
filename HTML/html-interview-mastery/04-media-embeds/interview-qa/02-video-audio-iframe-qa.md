*** copy 02-video-audio-iframe-qa.md ***

# Interview Q&A — Video, Audio, and Iframe

**Q: Why does `autoplay` require `muted` to actually work in modern browsers?**
Every major browser blocks autoplay of video/audio with sound as a deliberate anti-annoyance policy — unmuted autoplay was widely disliked. `autoplay muted` is reliably permitted since it can't produce unexpected audio; even then, some browsers apply additional engagement-based heuristics that can still block it, so autoplay should be treated as a best-effort enhancement with `controls` always available as a fallback.

**Q: What's the difference between `<track kind="captions">` and `<track kind="subtitles">`?**
Captions include transcribed dialogue plus relevant non-speech audio cues (e.g. "[door slams]"), intended for deaf/hard-of-hearing viewers watching with sound off. Subtitles are dialogue-only, assuming the viewer can already hear other audio, and are typically used for language translation rather than accessibility.

**Q: What does an empty `sandbox` attribute on an `<iframe>` do, and how do you selectively loosen it?**
It applies maximum restriction: no scripts, no form submission, no same-origin access, no popups, no top-level navigation. You then re-enable only what's needed via space-separated tokens like `allow-scripts`, `allow-forms`, `allow-same-origin`, `allow-popups`.

**Q: Why is combining `allow-scripts` and `allow-same-origin` in a sandboxed iframe potentially dangerous?**
Together, they let the embedded page's JavaScript access its own frame with full same-origin privileges, which can be used to strip its own sandbox restrictions — effectively defeating the sandbox. This combination should only be used for genuinely trusted content, not untrusted third-party embeds.

**Q: What does `preload="metadata"` do on a `<video>`, and why is it often a good default?**
It fetches only the video's duration/dimensions upfront (enough to render the player UI correctly) without downloading the actual video data until the user presses play — a good middle ground between `none` (nothing preloaded, slightly slower to start) and `auto` (browser may preload the whole file, wasting bandwidth for content the user might not watch).

**Q: What's the purpose of the `allow` attribute on an iframe, and how is it different from `sandbox`?**
`allow` (Permissions Policy) grants access to specific powerful browser features (camera, microphone, fullscreen, geolocation) that the embedded content otherwise cannot use even with user permission. `sandbox` restricts a broader set of general browsing-context capabilities (scripts, forms, navigation, popups). They're independent, complementary mechanisms — an iframe often needs both configured correctly for a feature-rich but properly-restricted embed.
