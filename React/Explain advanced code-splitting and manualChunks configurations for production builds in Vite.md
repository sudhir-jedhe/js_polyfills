***  Explain advanced code-splitting and manualChunks configurations for production builds in Vite.md ***

Vite delegates its production bundling to **Rollup**, which means code-splitting is controlled via `build.rollupOptions.output.manualChunks`. Proper chunk splitting maximizes browser caching, reduces initial download sizes, and prevents massive single-bundle bottlenecks.

---

### How Default Code-Splitting Works in Vite

By default, Vite splits code along two primary boundaries:

1. **Dynamic Imports (`import()`):** Every lazy-loaded route or component automatically becomes a separate JavaScript chunk.
2. **Shared Dependencies:** If two dynamic chunks import the same module, Rollup extracts that shared code into a common chunk to prevent code duplication.

However, default splitting often leaves vendor dependencies bundled directly into the main entry chunk or creates unpredictable sub-chunks.

---

### 1. Object-Based `manualChunks` (Explicit Chunking)

The simplest way to isolate large, slow-changing third-party libraries (for long-term HTTP caching) is mapping package names directly to chunk names:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem in one chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Heavy UI/Chart libraries in their own chunk
          'charts-vendor': ['chart.js', 'react-chartjs-2'],
          
          // Utility libraries
          'utils-vendor': ['lodash-es', 'date-fns']
        }
      }
    }
  }
});

```

* **Best For:** Small-to-medium apps where dependencies are stable and well-known.
* **Caveat:** If module `A` in `react-vendor` imports module `B` in `charts-vendor`, you can accidentally create circular dependencies or prevent dead-code elimination.

---

### 2. Function-Based `manualChunks` (Dynamic Node Modules Splitting)

For larger applications, a dynamic function inspects the module ID (`id` is the absolute file path) and groups packages programmatically:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split huge individual packages into their own dedicated chunks
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('monaco-editor')) return 'vendor-monaco';
            if (id.includes('@tanstack')) return 'vendor-tanstack';

            // Group all other smaller node_modules into a generic vendor chunk
            return 'vendor';
          }
        }
      }
    }
  }
});

```

---

### 3. Advanced Pattern: Granular Per-Package Chunking

To optimize browser caching, each major NPM package can be placed in its own chunk. When you update one package (e.g., `axios`), users only re-download the `axios` chunk while the rest remain cached.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Extract the package name from node_modules path
            // e.g., /node_modules/@scope/pkg/index.js -> @scope/pkg
            // e.g., /node_modules/lodash-es/index.js -> lodash-es
            const parts = id.toString().split('node_modules/')[1].split('/');
            const packageName = parts[0].startsWith('@') 
              ? `${parts[0]}/${parts[1]}` 
              : parts[0];

            // Whitelist packages to split (avoid creating thousands of micro-chunks)
            const isolatedPackages = [
              'react', 
              'react-dom', 
              'lucide-react', 
              'framer-motion', 
              'zod'
            ];

            if (isolatedPackages.includes(packageName)) {
              return `pkg-${packageName.replace(/[@/]/g, '_')}`;
            }

            return 'vendor-common';
          }
        }
      }
    }
  }
});

```

---

### Pitfalls & Best Practices

* **The Circular Dependency Trap:** If chunk `X` and chunk `Y` import variables from each other, Rollup will output execution-order warnings and can break runtime initialization. Avoid aggressively splitting tightly coupled internal application source files.
* **HTTP/2 & Too Many Micro-Chunks:** Splitting every single tiny npm module into its own chunk can degrade performance due to TLS and request-header overhead. Group small utility libraries together.
* **CSS Code Splitting (`build.cssCodeSplit`):** Enabled by default in Vite. Async JS chunks will automatically load their own corresponding CSS chunks asynchronously. Keep this `true` unless you specifically require a single unified stylesheet.
* **Inspect Chunk Sizes:** Use the `rollup-plugin-visualizer` plugin to view a visual treemap of bundle sizes:

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true, filename: 'bundle-analysis.html' })
  ]
});

```
