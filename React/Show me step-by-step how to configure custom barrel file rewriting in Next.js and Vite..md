**Next.js Configuration**

Next.js provides built-in support for rewriting barrel imports without needing external plugins.

* **Option A: `optimizePackageImports` (Recommended)**
Tells Next.js/Turbopack to inspect and resolve named imports directly to their source files without evaluating unused exports:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@acme/ui', 'lucide-react', 'lodash-es'],
  },
};

export default nextConfig;

```

* **Option B: `modularizeImports` (Pattern-Based Path Rewriting)**
If you need exact string transformations for custom module layouts:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    '@acme/ui': {
      transform: '@acme/ui/dist/components/{{member}}',
      preventFullImport: true,
    },
    'lodash': {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
  },
};

export default nextConfig;

```

---

**Vite Configuration**

Vite handles rewriting via plugins or dependency pre-bundling.

* **Option A: Pre-bundling Third-Party Barrels (Built-in)**
Force `esbuild` to squash deep third-party barrel exports into single flattened files at startup:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@acme/ui', 'lucide-react'],
  },
});

```

* **Option B: Path Rewriting via `vite-plugin-importer` or Babel**
To rewrite internal barrel imports to direct paths on the fly:

1. Install the plugin:

```bash
npm install vite-plugin-importer --save-dev

```

1. Configure `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import usePluginImport from 'vite-plugin-importer';

export default defineConfig({
  plugins: [
    react(),
    usePluginImport({
      libraryName: '@acme/ui',
      customName: (name) => `@acme/ui/src/components/${name}`,
    }),
  ],
});

```

---

**Result**

When code imports a single element:

```typescript
import { Modal } from '@acme/ui';

```

The compiler automatically transforms the AST to:

```typescript
import { Modal } from '@acme/ui/src/components/Modal';

```

This skips traversing sibling modules, resolving circular dependencies, and parsing unused files.
