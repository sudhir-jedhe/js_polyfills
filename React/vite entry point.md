Unlike traditional bundlers (like Webpack or Rollup) that use a JavaScript file as the entry point, **Vite uses `index.html` as its default entry point.**

Vite treats the `index.html` file as source code and part of the module graph, rather than just a static asset to inject scripts into.

**How it works under the hood**

1. When you start the dev server, Vite serves `index.html` directly to the browser.
2. The browser parses the HTML and finds your native ES module script tag, which looks like this:
`<script type="module" src="/src/main.js"></script>`
3. The browser makes an HTTP request for `/src/main.js`.
4. Vite intercepts this request, transforms the JavaScript (resolving bare imports, compiling JSX/TS, etc.), and sends it back to the browser.

**Changing the Entry Point (Multi-Page Apps)**
If you are building an app with multiple HTML pages, you can specify different or multiple HTML entry points in `vite.config.js` via the Rollup `build.rollupOptions` object:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
});

```

**Changing the Entry Point (Library Mode)**
If you are building a reusable NPM package instead of a web app, you do not use an HTML entry point. Instead, you define a standard JavaScript/TypeScript file as the entry point using `build.lib`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'), // JS entry point
      name: 'MyLibrary',
      fileName: 'my-library'
    }
  }
});

```
