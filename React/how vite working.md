*** copy how vite working.md ***

Vite radically speeds up web development by rethinking how code is served during development versus how it is bundled for production.

Traditional tools (like classic Webpack) bundle your entire application into memory before starting the dev server. Vite completely skips bundle-time during development by leveraging **Native ES Modules (ESM)** in modern browsers and **esbuild**.

---

### 1. Development Mode: Unbundled & On-Demand

During development, Vite splits your application into two categories: **Dependencies** and **Source Code**.

```
Browser (Requests /src/App.vue or .jsx)
   │
   ▼  Native ESM HTTP Request
[ Vite Dev Server ] ──▶ Transforms requested file only (via esbuild/plugins)
   │
   ▼  Returns standard JS module
Browser (Executes & mounts instantly)

```

* **Pre-bundling Dependencies (esbuild):** External packages (like `react`, `lodash`, `axios`) often ship in CommonJS or have hundreds of internal files. Vite uses **esbuild** (written in Go) to pre-bundle them 10–100x faster than JavaScript-based bundlers and converts them to standard ESM.
* **On-Demand Source Code Serving:** Vite serves your application files directly over native browser ESM (`<script type="module">`). When you load a page, the browser requests only the exact `.js`/`.ts`/`.vue`/`.jsx` files needed for that specific route.
* **Instant Server Start:** Because no bundling happens upfront, dev servers start in milliseconds regardless of project size.

---

### 2. Lightning-Fast HMR (Hot Module Replacement)

In bundled setups, modifying one file often triggers a re-bundle of whole chunks and a page reload.

* In Vite, when a file is edited, the server sends an event over a WebSocket to the browser.
* The browser simply re-fetches **only the modified module** using standard ES import queries (e.g., `import '/src/Button.tsx?t=169000000'`).
* Application state is preserved, and updates reflect in milliseconds independent of the total number of modules in the app.

---

### 3. Production Mode: Optimized Bundling (Rollup / Rolldown)

While native ESM is ideal for development, serving hundreds of individual network requests in production creates network latency bottlenecks.

* Vite bundles your production code using **Rollup** (and transitioning to its high-performance Rust port, **Rolldown**).
* It applies standard production optimizations:
* **Tree-shaking:** Strips unused exports.
* **Code-splitting:** Splits vendor code and dynamic `import()` routes into separate chunks.
* **Asset inlining & CSS code-splitting:** Embeds small assets as base64 and scopes CSS to specific chunks.

---

### Vite vs. Traditional Bundlers

| Feature                  | Traditional Bundler (e.g., Webpack 4/5)         | Vite Dev Server                               |
| ------------------------ | ----------------------------------------------- | --------------------------------------------- |
| **Dev Server Start**     | Bundles all modules upfront (slow as app grows) | Instant (zero bundling, serves native ESM)    |
| **HMR Speed**            | Degrades as project complexity increases        | Constant time ($O(1)$) regardless of app size |
| **Transpilation Engine** | Node.js-based transpilers (Babel/Terser)        | Go-based `esbuild` (sub-second speeds)        |
| **Module Format**        | Virtual bundle files in memory                  | Standard HTTP requests via browser ESM        |
