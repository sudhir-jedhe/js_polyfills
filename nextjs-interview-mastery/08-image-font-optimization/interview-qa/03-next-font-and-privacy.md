# Interview Q&A: `next/font` and Privacy/Performance

**Q: What specific problems does `next/font` solve compared to a traditional `<link>` to Google Fonts?**
A: Two, concretely: performance — a `<link>` to an external font CDN adds a separate render-affecting network request (DNS lookup, connection setup, download) on top of your own server's requests, delaying text paint; and privacy — loading fonts directly from Google's CDN sends the visitor's IP address to Google on every page load, a real concern for GDPR-conscious teams. `next/font` downloads the font files at build time and self-hosts them from your own domain, eliminating both issues entirely — no runtime request to any external font provider.

**Q: Can you use a Google font and a local/custom font in the same layout?**
A: Yes — a common pattern is a Google Font for body copy (`next/font/google`) plus a local, licensed display/heading font (`next/font/local`). Both return an object with `.className` and (if configured) `.variable`; applying both fonts' `variable` at the root and referencing the right CSS custom property per element (body text vs. headings) is the idiomatic way to combine them.

**Q: How does `next/font` help with layout shift, specifically?**
A: It automatically calculates size-adjust font descriptors at build time that closely match the fallback system font's metrics (character width, line height) to the actual custom font's metrics — this significantly reduces the visible "jump" when the real font swaps in after the fallback font has already rendered text, something you'd otherwise have to hand-tune manually with a traditional font-loading setup.

**Q: What does `display: 'swap'` control, and is it always the right choice?**
A: It controls what happens while the font is still loading — `swap` renders text immediately using a fallback font, then swaps to the real font once available, prioritizing readability over avoiding the swap moment (versus the alternative of showing invisible text until the real font loads). It's the right default for most content-heavy pages where showing *some* readable text immediately matters more than avoiding a brief font swap; for tightly branded above-the-fold hero text where the swap itself would be visually jarring, some teams instead choose `display: 'optional'`, accepting that the fallback font might be used permanently on a slow connection rather than swapping in later at all.
