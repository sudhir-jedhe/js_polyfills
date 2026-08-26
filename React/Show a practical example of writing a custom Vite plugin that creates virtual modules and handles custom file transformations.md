*** copy Show a practical example of writing a custom Vite plugin that creates virtual modules and handles custom file transformations.md ***

Here is a complete, runnable example of a custom Vite plugin that accomplishes two common tasks:

1. **Virtual Module:** Creates an in-memory module (`virtual:build-info`) that exposes dynamic build metadata (git commit, timestamp, environment) without creating a real file on disk.
2. **Custom File Transformer:** Intercepts markdown files (`.md`) and compiles them into executable JavaScript exporting rendered HTML.

---

### Step 1: Implement the Plugin

Create a file named `myVitePlugin.js`:

```javascript
// myVitePlugin.js
import { marked } from 'marked'; // Example markdown parser (npm i -D marked)

export default function myCustomPlugin(options = {}) {
  // Virtual module conventions:
  // 1. User imports: 'virtual:build-info'
  // 2. Resolved ID prefixed with \0 to prevent other plugins from resolving it
  const virtualModuleId = 'virtual:build-info';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-custom-suite', // Required: unique plugin name

    // -------------------------------------------------------------
    // PART 1: Virtual Module Handling
    // -------------------------------------------------------------
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const buildInfo = {
          buildTime: new Date().toISOString(),
          version: options.version || '1.0.0',
          environment: process.env.NODE_ENV || 'development'
        };

        // Return standard JavaScript source code
        return `export const buildInfo = ${JSON.stringify(buildInfo)};`;
      }
    },

    // -------------------------------------------------------------
    // PART 2: Custom File Transformation (.md -> JS module)
    // -------------------------------------------------------------
    transform(code, id) {
      // Check if file is a Markdown file
      if (id.endsWith('.md')) {
        const html = marked.parse(code);

        // Convert the HTML string into an ES Module export
        return {
          code: `export const html = ${JSON.stringify(html)};\nexport default html;`,
          map: null // Optional: provide source map if generating complex code
        };
      }
    }
  };
}

```

---

### Step 2: Register in `vite.config.js`

Add your plugin to the `plugins` array:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import myCustomPlugin from './myVitePlugin';

export default defineConfig({
  plugins: [
    myCustomPlugin({
      version: '2.4.0'
    })
  ]
});

```

---

### Step 3: TypeScript Declarations (Optional but Recommended)

If using TypeScript, declare the virtual module and markdown imports in `vite-env.d.ts` so the compiler recognizes them:

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module 'virtual:build-info' {
  export const buildInfo: {
    buildTime: string;
    version: string;
    environment: string;
  };
}

declare module '*.md' {
  export const html: string;
  const defaultExport: string;
  export default defaultExport;
}

```

---

### Step 4: Consume in Application Code

Now both features work seamlessly with full Vite HMR support in both dev and production builds:

```javascript
// src/main.js

// 1. Consume the Virtual Module
import { buildInfo } from 'virtual:build-info';

// 2. Import a raw .md file as transformed HTML
import readmeHtml from '../README.md';

console.log('App Build Info:', buildInfo);
// Output: { buildTime: "2026-08-26T...", version: "2.4.0", environment: "development" }

// Inject the transformed markdown directly into the DOM
document.querySelector('#app').innerHTML = `
  <div class="build-banner">
    Version: <strong>${buildInfo.version}</strong> (Built: ${buildInfo.buildTime})
  </div>
  <article class="markdown-body">
    ${readmeHtml}
  </article>
`;

```

---

### How It Works Under the Hood

* **The `\0` prefix:** The Rollup/Vite convention uses a leading null byte (`\0`) on resolved virtual module IDs to signal to subsequent plugins and file system resolvers that this is an in-memory synthetic file, skipping disk lookups.
* **Module Invalidation:** During local development, editing `README.md` triggers Vite's module graph to flag that ID as dirty, causing Vite to rerun `transform()` and push an instant HMR update to the browser without a full page reload.
