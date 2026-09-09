### 1. What did you learn yesterday/this week?

Explored the **View Transitions API** (both same-document and multi-page cross-document transitions via CSS `@view-transition`) and how to coordinate it with CSS `@starting-style` to animate entry/exit states on top-layer DOM elements (like native `<dialog>` and Popover elements) without relying on heavy JavaScript animation libraries.

---

### 2. What excites or interests you about coding?

The immediate feedback loop between writing code and delivering functional, accessible user experiences. Front-end engineering sits directly at the intersection of systems design (state machines, streaming architectures, network optimization) and human-computer interaction, where a 100ms optimization directly impacts accessibility and user trust.

---

### 3. What is a recent technical challenge you experienced and how did you solve it?

* **Problem:** Severe UI thread jank and memory spikes when rendering a large, filterable data table containing over 15,000 items with interactive cells.
* **Root Cause:** Excessive DOM footprint (tens of thousands of active nodes) triggering massive layout recalculations on filter inputs.
* **Solution:**

1. Implemented windowing/virtualization (rendering only visible rows in the viewport + an overscan buffer).
2. Offloaded client-side text filtering and multi-column sorting to a **Web Worker** via a typed array message channel, freeing up the main thread.
3. Applied CSS `contain: strict` and `content-visibility: auto` to row containers, reducing rendering work and dropping Frame Drop to zero.

---

### 4. When building or maintaining a website, what techniques increase performance?

* **Critical Rendering Path:** Inlining critical CSS, deferring non-critical assets, and loading scripts via `defer` or `<script type="module">`.
* **Asset Compression & Modern Formats:** Serving AVIF/WebP images, WOFF2 variable fonts with `unicode-range`, and compressing static assets using Brotli (`br`).
* **Bundle Splitting:** Dynamic `import()` based on routes or user interactions to eliminate oversized monobundles.
* **Network Tuning:** Utilizing HTTP/2 or HTTP/3 multiplexing, early prefetching (`rel="preload"`, `rel="preconnect"` for CDNs), and 103 Early Hints.
* **Runtime Execution:** Debouncing/throttling high-frequency DOM event listeners, virtualizing large lists, and keeping animations strictly on compositor threads (`transform`, `opacity`).

---

### 5. SEO best practices and techniques

* **Semantic HTML:** Using single `<h1>` page tags, clear heading hierarchies (`<h2>`, `<h3>`), `<main>`, `<article>`, and `<nav>` to convey document outlines.
* **Server/Edge Rendering:** Ensuring search crawlers receive pre-rendered HTML rather than empty root containers (`<div id="root"></div>`).
* **Structured Data:** Implementing JSON-LD schemas (`Article`, `BreadcrumbList`, `Product`, `FAQPage`) for enhanced search engine rich snippets.
* **Metadata & Indexing Control:** Dynamic `canonical` tags to avoid duplicate-content penalties, Open Graph/Twitter card tags for social indexing, and granular `robots.txt` configuration.
* **Core Web Vitals:** Keeping LCP under 2.5s, INP under 200ms, and CLS under 0.1 to avoid search engine ranking penalties.

---

### 6. Front-end security: Common techniques and recent issues

* **Cross-Site Scripting (XSS):** Sanitizing any untrusted user inputs with libraries like DOMPurify, escaping strings before rendering, and enforcing an explicit **Content Security Policy (CSP)** to disallow `unsafe-inline` scripts.
* **Cross-Site Request Forgery (CSRF):** Relying on `SameSite=Lax` or `SameSite=Strict` flags on session cookies and pairing mutating requests with anti-CSRF tokens in custom headers (`X-CSRF-Token`).
* **Cross-Origin Leaks:** Configuring headers like `Cross-Origin-Opener-Policy (COOP)` and `Cross-Origin-Embedder-Policy (COEP)` to isolate browsing contexts and mitigate side-channel timing attacks (e.g., Spectre).
* **Clickjacking:** Enforcing the `X-Frame-Options: DENY` or `frame-ancestors 'none'` CSP directive.
* **Dependency Auditing:** Regularly running Automated SCA (Software Composition Analysis) and `npm audit` to catch supply-chain vulnerabilities in open-source packages.

---

### 7. Actions taken to increase code maintainability

* **Strict Static Typing:** Enforcing TypeScript with `strict: true` and eliminating `any` types to catch contract breaks at compile-time.
* **Component Architecture:** Adhering to the Single Responsibility Principle, isolating presentational components from container/data-fetching logic.
* **Unified Tooling:** Standardizing ESLint, Prettier, and Stylelint rules enforced via Git pre-commit hooks (Husky / lint-staged).
* **Automated Testing:** Writing unit tests for deterministic business logic, integration tests with testing libraries, and end-to-end tests for critical user journeys (Playwright).
* **Design Systems & Storybook:** Building modular, documented UI components isolated from API state.

---

### 8. Preferred development environment

* **Editor:** VS Code with keybindings configured, equipped with TypeScript, ESLint, Prettier, and GitLens extensions.
* **Terminal & Shell:** Zsh / Starship prompt with custom aliases for Git workflows.
* **Tooling Runtime:** Modern, fast bundlers like Vite, Turbopack, or esbuild for near-instant Hot Module Replacement (HMR).
* **Debugging Tools:** Chrome DevTools (Performance profile panels, Memory heap snapshots, Network tab, Rendering layers).

---

### 9. Version control systems

* **Git:** Primary tool used daily across command-line interfaces and visual diff tools.
* **Workflows:** Trunk-based development with short-lived feature branches, interactive rebasing (`git rebase -i`), squashing, and cherry-picking.
* **Platforms:** GitHub, GitLab, and Bitbucket with branch protection rules and CI/CD pipelines.
* *Familiarity with legacy systems:* Exposure to SVN (Subversion) and Mercurial in older codebases.

---

### 10. Workflow when creating a web page

1. **Requirements & Scope:** Review design specs (Figma), design system tokens, and edge states (empty, loading, error, long text).
2. **Semantic Skeleton:** Build raw, accessible HTML structure using proper semantic landmarks (`<header>`, `<main>`, `<section>`).
3. **Responsive Styles:** Write mobile-first CSS using modern layout modules (CSS Grid/Flexbox) and Logical Properties.
4. **State & Interactivity:** Layer on state management, accessible interactions (keyboard focus traps, ARIA attributes), and API integrations.
5. **Audit & Optimization:** Run Lighthouse, Axe Accessibility scans, profile Core Web Vitals, and verify cross-browser compatibility.

---

### 11. Integrating 5 different stylesheets

* **Modern Build Pipeline:** Import them via a bundler (Vite/Webpack) that compiles, treeshakes unused rules, minifies, and bundles them into an optimized output file (or route-level chunks) loaded via a single `<link rel="stylesheet">`.
* **CSS Cascade Layers (`@layer`):** If combining legacy or distinct structural sheets (e.g., reset, framework, themes, utilities), wrap them in `@layer` declarations to guarantee cascade priority independent of selector specificity:

```css
@layer reset, framework, components, utilities;
@import "reset.css" layer(reset);
@import "framework.css" layer(framework);

```

* **Critical CSS Splitting:** Extract above-the-fold critical CSS directly into an inline `<style>` block in `<head>`, deferring the remainder asynchronously.

---

### 12. Progressive Enhancement vs. Graceful Degradation

* **Progressive Enhancement:**
* Starts with a functional baseline that works on any browser/device (core HTML and basic styling).
* Enhances the experience with advanced CSS, JavaScript interactivity, and cutting-edge APIs for modern browsers.
* *Philosophy:* Content-first; everyone gets access to the core experience.

* **Graceful Degradation:**
* Builds the product targeting the latest, most capable browser environments from the start.
* Adds fallbacks or polyfills to ensure the application doesn't completely crash when viewed in older or restricted browsers.
* *Philosophy:* Feature-first; older clients get an acceptable degraded version.

---

### 13. Optimizing a website's assets/resources

* **Images & Media:** Convert to next-gen formats (AVIF/WebP), compress SVGs via SVGO, generate responsive `srcset` resolutions, and use native `loading="lazy"`.
* **JavaScript & CSS:** Minify (via Terser/esbuild), remove dead code through tree-shaking, and split vendor code from application logic.
* **Fonts:** Preload primary web fonts, subset glyphs to used languages, convert to WOFF2, and use `font-display: swap`.
* **Caching:** Set aggressive immutable cache headers (`Cache-Control: public, max-age=31536000, immutable`) paired with content-hashed filenames.

---

### 14. Browser download limits per domain & exceptions

* **HTTP/1.1 Limit:** Standard browsers open a maximum of **6 concurrent TCP connections per origin/domain**.
* **Exceptions & Workarounds:**
* **Domain Sharding (HTTP/1.1):** Hosting assets across subdomains (`cdn1.example.com`, `cdn2.example.com`) to multiply connection limits (largely an anti-pattern today).
* **HTTP/2 and HTTP/3:** Eliminates this limit via **Multiplexing**; all requests to the same origin flow asynchronously through a single TCP/QUIC connection without blocking each other.
* **WebSockets / Server-Sent Events:** Run over persistent individual connections outside standard HTTP batch-polling rules.

---

### 15. Three ways to decrease page load (perceived or actual)

1. **Critical CSS Inlining & JavaScript Deferral (Actual):** Inlining above-the-fold styles directly into `<head>` while deferring heavy bundles eliminates render-blocking network round trips.
2. **Skeleton Screens & Content Placeholders (Perceived):** Immediate wireframe rendering prevents layout snapping and communicates progress faster than spinner icons.
3. **Speculative Pre-fetching (Actual & Perceived):** Using `<link rel="prefetch">` or the Speculation Rules API on hovered/predicted links loads resources into memory before the user finishes clicking.

---

### 16. Tabs vs. Spaces on a team project

**Always follow the existing project conventions.**
Consistency across the codebase takes absolute priority over personal preferences. Check if an `.editorconfig` or `.prettierrc` file exists; if not, introduce one matching the team's consensus so formatting is automated and non-debatable during code reviews.

---

### 17. How to build a simple slideshow page

* **HTML Structure:** A semantic container (`<div role="region" aria-roledescription="carousel" aria-label="Featured Items">`) enclosing an ordered list of slides (`<ul>`, `<li>`), with previous/next buttons and pagination dots.
* **CSS:** Use CSS Scroll Snap (`scroll-snap-type: x mandatory; overflow-x: auto; display: flex;`) so navigation works smoothly using hardware-accelerated gestures without heavy JavaScript calculation.
* **JavaScript:**
* Add click handlers for buttons to scroll by element widths (`scrollBy({ left: width, behavior: 'smooth' })`).
* Listen to keyboard events (`ArrowLeft`, `ArrowRight`).
* Ensure accessible focus management and update `aria-current="true"` on indicator elements.

---

### 18. Technology to master this year

**WebAssembly (Wasm) and WebGPU.**
As web applications move toward running native-grade compute (client-side ML models, image processing, complex data analytics engines), understanding low-level memory allocation, SIMD, and GPU shader programming enables performance gains impossible in raw JavaScript.

---

### 19. The importance of standards and standards bodies

Standards bodies (W3C, WHATWG, TC39, IETF) ensure the web remains an **open, interoperable ecosystem** rather than a fragmented landscape dominated by proprietary vendor silos.

* **Interoperability:** Guarantees code written today runs reliably across Chrome, Firefox, Safari, and Edge.
* **Longevity & Backward Compatibility:** Prevents legacy websites from breaking when browser engines update.
* **Security & Accessibility Standards:** Ensures uniform security policies (CORS, CSP) and standardized accessibility baselines (WCAG).

---

### 20. What is FOUC and how do you avoid it?

* **Flash of Unstyled Content (FOUC):** Occurs when the browser renders the DOM before the external stylesheets are downloaded and parsed, causing an unstyled HTML page to flash briefly before styles snap into place.
* **How to avoid it:**
* Always position `<link rel="stylesheet">` tags inside the document `<head>`.
* Inline critical styles directly in `<head>`.
* For dynamic theme switching (e.g., dark mode based on local storage), run a small, synchronous inline script in `<head>` that sets the theme class on `<html>` before first paint.

---

### 21. ARIA, screen readers, and website accessibility

* **Screen Readers:** Assistive technologies (JAWS, NVDA, VoiceOver) that parse the browser's **Accessibility Tree** and convert visual elements into speech or braille output.
* **ARIA (Accessible Rich Internet Applications):** A specification of HTML attributes (`role`, `aria-expanded`, `aria-hidden`) that provide semantic context when native HTML tags are insufficient. *First rule of ARIA: Do not use ARIA if a native semantic HTML element exists.*
* **Accessibility Techniques:**
* Full keyboard navigability (logical tab order, visible `:focus-visible` states, focus trapping inside modals).
* Color contrast ratios meeting WCAG 2.1 AA standards (minimum 4.5:1 for normal text).
* Meaningful `alt` attributes on informative images; empty `alt=""` on purely decorative ones.

---

### 22. CSS animations vs. JavaScript animations

| Feature         | CSS Animations (`@keyframes`, `transition`)                                                        | JavaScript Animations (WAAPI, GSAP)                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Performance** | Offloaded to the compositor thread (`transform`, `opacity`); unaffected by main-thread JS blocks.  | Runs on the main JavaScript thread unless using the Web Animations API (WAAPI).                               |
| **Complexity**  | Best for declarative, static transitions (toggles, hover states, UI entrances).                    | Best for complex choreographies, physics simulations, canvas rendering, or gesture tracking.                  |
| **Control**     | Limited runtime control; difficult to dynamically pause, reverse, or scrub to specific timeframes. | Full control: programmatic timeline scrub, reverse, interrupt, callback triggers, and dynamic recalculations. |

---

### 23. What is CORS and what issue does it address?

* **Definition:** **Cross-Origin Resource Sharing** is a browser security mechanism based on HTTP headers.
* **The Problem:** The browser's **Same-Origin Policy (SOP)** blocks scripts on one origin (e.g., `site-a.com`) from reading responses requested from another origin (e.g., `api-b.com`), preventing malicious sites from snooping on authenticated user data.
* **How CORS Solves It:** Allows the target server to explicitly declare who can read its data via response headers (e.g., `Access-Control-Allow-Origin: [https://site-a.com](https://site-a.com)`), safely relaxing SOP constraints when cross-origin communication is intended.

---

### 24. Handling disagreements with a collaborator or lead

1. **Focus on Data & Metrics:** Shift discussions away from personal preferences toward measurable criteria (performance benchmarks, bundle size impact, accessibility compliance, or maintenance overhead).
2. **Prototype & Test:** Build quick, minimal Proof of Concepts (POCs) for both approaches to evaluate trade-offs directly.
3. **Commit to Consensus:** If consensus cannot be reached, follow the engineering lead's decision, document the underlying reasoning and potential risks, and execute with full commitment.

---

### 25. Resources for staying up-to-date

* **Official Specs & Updates:** TC39 proposals, WHATWG living standard changes, and W3C working drafts.
* **Browser Engineering Blogs:** Chrome Developers, WebKit Blog, and Mozilla Hacks.
* **Technical Aggregators:** web.dev, Smashing Magazine, and CSS-Tricks.
* **Conferences & Discussions:** Reviewing deep-dive technical talks from JSConf, ViteConf, and following core team maintainers on GitHub.

---

### 26. Essential skills for a modern front-end developer

* **Foundational Competence:** Mastery of semantic HTML, CSS architecture (Flexbox, Grid, Cascade Layers, layout algorithms), and core JavaScript/TypeScript fundamentals.
* **Systems Architecture:** Understanding state management, component lifecycle, bundle optimization, and API caching strategies.
* **Performance & Accessibility:** Profiling with browser developer tools, optimizing Core Web Vitals, and implementing WCAG compliance.
* **Cross-Disciplinary Collaboration:** Communicating effectively with UX/UI designers, backend engineers, and product stakeholders.

---

### 27. Role alignment

Operating as a **Senior / Lead Front-End Engineer**, taking ownership of end-to-end frontend architecture, setting engineering standards, guiding design system implementations, and bridging technical delivery with product priorities.

---

### 28. What happens when you enter a URL into the browser?

1. **URL Parsing:** The browser breaks down the string into protocol, domain, port, and path.
2. **DNS Resolution:** Checks browser cache, OS cache, router cache, and queries DNS servers to translate the domain into an IP address.
3. **TCP Connection & TLS Handshake:** Establishes a connection (TCP 3-way handshake) followed by TLS negotiation for encrypted HTTPS sessions.
4. **HTTP Request & Response:** The browser sends an HTTP `GET` request; the server processes it and returns HTML (often accompanied by status codes and cache headers).
5. **Critical Rendering Path:**

* **Parse HTML:** Tokenizes and constructs the **DOM** (Document Object Model).
* **Parse CSS:** Constructs the **CSSOM** (CSS Object Model).
* **Render Tree:** Combines DOM and CSSOM, ignoring hidden nodes (`display: none`).
* **Layout (Reflow):** Computes geometric dimensions and viewport positions for every visible element.
* **Paint:** Fills in pixels (colors, borders, text, shadows) into layers.
* **Compositing:** Combines distinct layers onto the screen via the GPU.

---

### 29. SSR vs. CSR: Pros and Cons

| Category         | Server-Side Rendering (SSR)                                                                        | Client-Side Rendering (CSR)                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **How it works** | Server compiles components and returns fully populated HTML on every request.                      | Server returns an empty HTML shell; JavaScript downloads and constructs the UI in the browser.  |
| **Pros**         | Fast First Contentful Paint (FCP); reliable SEO across all search crawlers; good for slow devices. | Smooth page transitions without full-page reloads; offloads rendering compute costs to clients. |
| **Cons**         | Higher server load/cost; higher Time to First Byte (TTFB); interactive delay during hydration.     | Slower initial FCP/LCP; poor baseline SEO without dynamic rendering; large initial JS bundles.  |

---

### 30. Static Rendering (SSG)

**Static Site Generation** pre-renders HTML pages entirely at **build time** rather than on each request.

* **Pros:** Extremely fast delivery via CDNs, high security (no dynamic application server running), zero server CPU cost per request.
* **Cons:** Build times increase as pages multiply; real-time dynamic data requires client-side fetching or Incremental Static Regeneration (ISR).

---

### 31. What is Rehydration?

**Rehydration** is the client-side process where a JavaScript framework (such as React or Vue) inspects the server-rendered HTML already present in the DOM, reconstructs the virtual DOM state internally, and attaches event listeners to make the static markup fully interactive.

* **Trade-off (The "Uncanny Valley"):** Users may see visible buttons and links (rendered via static HTML) but experience a brief delay where clicking them does nothing until the JavaScript bundle finishes downloading, parsing, and completing hydration. Modern patterns like **Islands Architecture** (Astro) or **Resumability** (Qwik) solve this by avoiding full-tree rehydration.
