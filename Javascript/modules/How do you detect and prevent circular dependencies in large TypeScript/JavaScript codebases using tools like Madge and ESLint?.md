To catch and eliminate circular dependencies before they hit production, large codebases typically use a **layered defense strategy**: static analysis in **ESLint** during local development, graph-level verification via **Madge** or **Knip/Dpdm** in CI/CD pipelines, and **TypeScript compiler configurations**.

---

### Layer 1: Detecting Cycles in CI/CD with Madge

**Madge** is a dedicated static analysis tool that parses your module dependency tree and detects graph cycles. It is ideal for pre-commit hooks and CI pipelines because it provides an immediate non-zero exit code if cycles are found.

#### 1. Installation

```bash
npm install --save-dev madge

```

#### 2. Run CLI Checks

```bash
# For JavaScript:
npx madge --circular ./src

# For TypeScript (with tsconfig path resolution):
npx madge --circular --ts-config ./tsconfig.json --extensions ts,tsx,js,jsx ./src

```

#### 3. Add to `package.json` for CI Enforcement

```json
{
  "scripts": {
    "lint:circular": "madge --circular --ts-config ./tsconfig.json --extensions ts,tsx,js,jsx ./src"
  }
}

```

* If Madge finds a circular loop, it prints the exact file chain and exits with code `1` (failing the CI build):

```text
✖ Found 1 circular dependency!

1) src/auth/userService.ts > src/auth/tokenService.ts > src/auth/userService.ts

```

#### 4. Visualizing Cycles

Madge can export a visual graph (requires Graphviz installed locally):

```bash
npx madge --circular --image graph.svg ./src

```

---

### Layer 2: Real-Time Detection via ESLint (IDE & Linting)

ESLint catches circular imports in real-time inside developer editors (VS Code / WebStorm) via `eslint-plugin-import` (or `@typescript-eslint`).

#### 1. Installation

```bash
npm install --save-dev eslint-plugin-import

```

#### 2. ESLint Configuration (`.eslintrc.cjs` or flat config `eslint.config.js`)

Enable the `import/no-self-import` and `import/no-cycle` rules:

```javascript
// Flat config: eslint.config.js (or .eslintrc.json)
import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Disallows a module from importing itself
      'import/no-self-import': 'error',

      // Detects circular dependencies across files
      'import/no-cycle': [
        'error',
        {
          maxDepth: Infinity,       // Depth of cycles to inspect
          ignoreExternal: true,     // Skip node_modules (speeds up linting)
          allowUnsafeDynamicCyclicImports: false,
        },
      ],
    },
  },
];

```

> **Performance Tip for Large Monorepos:** Running `import/no-cycle` with `maxDepth: Infinity` across 10,000+ files can slow down `eslint`. If your lint pass becomes sluggish, set `maxDepth: 5` for routine linting, and rely on Madge or Dpdm in CI for deep whole-project graph traversal.

---

### Layer 3: Modern Alternatives for TypeScript

For large modern TypeScript codebases, several specialized tools offer faster checks and type-aware handling:

* **`dpdm`:** A blazingly fast alternative to Madge written specifically for TypeScript. It parses TS AST directly without transpilation:

```bash
npx dpdm --exit-code circular:1 --tree src/index.ts

```

* **`import type` (TypeScript 3.8+):** TypeScript interfaces and types do not exist at runtime. If two files only need each other's types, use `import type`:

```typescript
// userService.ts
import type { TokenPayload } from './tokenService'; // Zero runtime footprint, cannot cause runtime TDZ!

```

---

### Architectural Refactoring: How to Fix Identified Cycles

When a tool flags a circular loop (`A -> B -> A`), use one of these three architectural refactoring patterns to break it:

**1. Extract Shared State / Types to a Third Module (Leaf Module)**

* *Problem:* `User.ts` imports `Role.ts`, and `Role.ts` imports `User.ts`.
* *Fix:* Extract common interfaces or utility functions into a separate `types.ts` or `userConstants.ts` that both modules import.

**2. Dependency Inversion / Callbacks**

* Instead of Module A importing Module B directly, pass Module B's function or class as an argument/callback to Module A at runtime.

**3. Avoid Barrel File (`index.ts`) Internal Cycles**

* In large codebases, cycles are frequently accidental artifacts of importing from parent `index.ts` files (e.g., `import { helper } from '../'`).
* *Rule:* Never import from your own barrel file within the same feature folder; always import directly from the sibling file.
