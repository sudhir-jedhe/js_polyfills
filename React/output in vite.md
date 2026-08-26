*** copy output in vite.md ***

In Vite, **output** refers to how and where your compiled assets are generated when you run the production build command (`vite build` or `npx vite build`).

---

### Default Output Structure

By default, running `vite build` creates a **`dist/`** directory in your project root with hashed, production-ready assets:

```
dist/
├── index.html                   # HTML entry with injected asset links
└── assets/
    ├── index-B8x3Z1a.js         # Minified & tree-shaken JavaScript bundle
    ├── index-C4e9Y2b.css        # Extracted and scoped CSS
    └── logo-D7w1K9p.png         # Processed static assets (hashed for caching)

```

---

### Key Configuration Options (`vite.config.js`)

You configure build outputs under the `build` object in `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 1. Output directory (default: 'dist')
    outDir: 'build',

    // 2. Empty the outDir before building (default: true)
    emptyOutDir: true,

    // 3. Asset inlining threshold (default: 4096 bytes -> 4KB)
    // Assets smaller than this are converted to base64 Data URLs
    assetsInlineLimit: 4096,

    // 4. Generate source maps (default: false)
    sourcemap: true,

    // 5. Fine-grained Rollup output configuration
    rollupOptions: {
      output: {
        // Custom naming patterns for generated files
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        // Manual code splitting (e.g., isolate vendor chunks)
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});

```

---

### Application Mode vs. Library Mode Output

| Mode                           | Entry Point                                       | Primary Output                                                            | Use Case                                 |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------- |
| **App Mode** *(Default)*       | `index.html`                                      | `dist/index.html` + hashed JS/CSS assets in `dist/assets/`                | Single Page Apps (SPAs), websites        |
| **Library Mode** (`build.lib`) | JavaScript/TypeScript file (e.g., `src/index.ts`) | Clean ESM (`.js`/`.mjs`) and CommonJS (`.cjs`) files without `index.html` | NPM packages, UI components, shared SDKs |

#### Library Mode Output Example

```javascript
// vite.config.js for a library
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MyLib',
      formats: ['es', 'cjs'],
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      // Prevent bundling external peer dependencies
      external: ['react'],
      output: {
        globals: { react: 'React' }
      }
    }
  }
});

```

* **Generated files:**
* `dist/my-lib.es.js` (for modern ESM bundlers)
* `dist/my-lib.cjs.js` (for Node.js / CommonJS consumers)

---

### Previewing the Production Output

To test the generated output locally using a lightweight static server:

```bash
# 1. Build the production output
npm run build

# 2. Start Vite's local preview server pointing to dist/
npm run preview

```
