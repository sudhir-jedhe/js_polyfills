Migrating a TypeScript project to ESLint v9 Flat Config replaces the legacy `.eslintrc.*` and `.eslintignore` files with a single `eslint.config.mjs` (or `eslint.config.js` / `eslint.config.ts`) file using the unified `typescript-eslint` library.

---

### 1. Update Dependencies

Install ESLint 9 and the modern `typescript-eslint` package (which bundles both the parser and plugin):

```bash
npm install --save-dev eslint@^9 typescript-eslint @eslint/js globals

```

---

### 2. Concept Mapping: Legacy vs. Flat Config

| Legacy `.eslintrc`                     | ESLint v9 Flat Config                                              |
| -------------------------------------- | ------------------------------------------------------------------ |
| **`extends: [...]`**                   | Array elements inside `tseslint.config(...)` or config spread      |
| **`parser` & `parserOptions**`         | `languageOptions.parser` and `languageOptions.parserOptions`       |
| **`env`**                              | `languageOptions.globals: { ...globals.browser, ...globals.node }` |
| **`ignorePatterns` / `.eslintignore**` | Top-level `{ ignores: ['dist/**', 'build/**'] }` object            |
| **`plugins: [...]`**                   | Direct object reference in `plugins: { ... }`                      |
| **`overrides: [...]`**                 | Dedicated config objects with specific `files` arrays              |

---

### 3. Complete Migration Example

#### Before: Legacy `.eslintrc.cjs` + `.eslintignore`

```javascript
// .eslintrc.cjs (Legacy)
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};

```

```text
# .eslintignore (Legacy)
dist
node_modules
coverage
*.config.js

```

---

#### After: Modern `eslint.config.mjs`

Delete `.eslintrc.*` and `.eslintignore`, then create `eslint.config.mjs` at the root of your project:

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // 1. Global Ignores (Replaces .eslintignore)
  {
    ignores: ['dist/**', 'coverage/**', 'build/**', '**/*.d.ts'],
  },

  // 2. Base JavaScript Rules & Global Environments
  eslint.configs.recommended,

  // 3. TypeScript Recommended Configs (Enables parser + rules automatically)
  ...tseslint.configs.recommendedTypeChecked,

  // 4. Project-wide Language Options & Type-Checking Setup
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        // Modern type-aware linting in typescript-eslint v8+:
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 5. Custom Rule Overrides for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // 6. Disable Type-Checking on Config & Script Files
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  }
);

```

---

### 4. Key Migration Gotchas & Improvements

#### A. Type-Aware Linting with `projectService`

Instead of manually maintaining arrays of `project: ['./tsconfig.json', './tsconfig.node.json']`, use `projectService: true`. It automatically locates the nearest `tsconfig.json` for each file and falls back gracefully for standalone scripts.

#### B. Global Ignores vs. Scoped Ignores

* A config object with **only** an `ignores` key acts as a **global ignore** (equivalent to `.eslintignore`):

```javascript
{ ignores: ['dist/**', 'coverage/**'] }

```

* If a config object has both `files` and `ignores`, the ignore only applies to that specific configuration block.

#### C. Integrating Legacy Plugins via `@eslint/eslintrc`

If you use a third-party plugin that does not yet natively support Flat Config, wrap it using `FlatCompat`:

```javascript
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  ...compat.extends('plugin:react-hooks/recommended'),
);

```

---

### 5. Verification

Update your lint script in `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}

```

Run `npm run lint` or inspect the computed flat config hierarchy:

```bash
npx eslint --inspect-config

```
