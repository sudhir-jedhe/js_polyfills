*** copy README.md ***

# Media & Embeds

Modern web pages ship images, video, audio, and third-party embeds that must work across wildly different screen sizes, pixel densities, network conditions, and security contexts. HTML gives you real, native tools for this — `srcset`/`sizes` for responsive images, `<picture>` for art direction, native `loading="lazy"`, `<video>`/`<audio>` with accessible tracks, and `<iframe sandbox>` for safely embedding untrusted content — and interviewers use this topic to check whether a candidate reaches for these platform features or reinvents them badly in JavaScript. This topic also covers the HTML/CSS interplay of `object-fit`/`object-position`, and when to reach for SVG, canvas, or a plain `<img>`.

## Folder structure

- **`theory/`** — responsive images (`srcset`/`sizes`/`loading`/`decoding`), the `<picture>` element and art direction, `<video>`/`<audio>` attributes, `<iframe>` sandboxing/security, `object-fit`/`object-position`, and SVG inline-vs-external plus canvas basics.
- **`snippets/`** — 7 runnable examples: `srcset`/`sizes`, art-directed `<picture>`, video with tracks, audio, sandboxed iframe, `object-fit: cover`, and inline vs. `<img>`-referenced SVG.
- **`output-based/`** — 6 "what does the browser actually load/render?" questions covering `srcset` selection, lazy loading, `<picture>` fallbacks, and iframe sandbox restrictions.
- **`scenarios/`** — 5 real-world situations: a responsive hero image strategy, securely embedding third-party video, optimizing image loading for performance, an accessible captioned video player, and choosing SVG vs. canvas vs. `<img>` for an icon system.
- **`interview-qa/`** — 3 themed files: images/`<picture>`, video/audio/iframe, and SVG/canvas/`object-fit`.
- **`problems/`** — 4 hands-on build challenges: a responsive image component, an accessible captioned video player, a securely sandboxed iframe embed, and an art-directed picture hero.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- `<img>` responsive attributes: `srcset` (width and density descriptors), `sizes`, `loading="lazy"`, `decoding="async"`
- `<picture>`/`<source>` for true art direction (different crops/images per breakpoint, not just different resolutions of the same image)
- `<video>`/`<audio>` elements: `controls`, `autoplay` (and why it requires `muted`), `poster`, `preload`, and `<track>` for captions/subtitles
- `<iframe>` embedding, the `sandbox` attribute's restriction flags, and `allow`/permissions-policy security considerations
- `object-fit`/`object-position` (CSS properties, but specifically for replaced elements like `<img>`/`<video>`) and how they interact with intrinsic aspect ratio
- Inline SVG vs. `<img src="*.svg">` vs. CSS `background-image` SVG — trade-offs in styling control, accessibility, and caching
- Canvas basics: when a raster drawing surface is the right tool vs. SVG/DOM-based approaches
- General responsive media strategy: choosing the right combination of these tools for a given performance/accessibility requirement
