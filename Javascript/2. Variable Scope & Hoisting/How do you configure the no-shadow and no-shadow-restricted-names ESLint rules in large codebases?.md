In large codebases, configuring variable shadowing rules prevents subtle bugs (like accidentally hiding outer helper functions, global objects, or state variables) while avoiding false positives on common patterns such as enum names, type parameters, and standard callback arguments.

---

### 1. The Two Shadowing Rules Explained

* **`no-shadow-restricted-names` (Zero-Tolerance Security Rule):** Disallows redefining/shadowing global built-ins and restricted keywords (such as `undefined`, `NaN`, `Infinity`, `arguments`, `eval`).
* **`no-shadow` (Scope Collision Rule):** Disallows declaring variables in inner scopes that share names with variables in outer enclosing scopes.

---

### 2. The TypeScript Pitfall (Crucial Prerequisite)

If you use TypeScript, the core ESLint `no-shadow` rule **must be disabled** and replaced with `@typescript-eslint/no-shadow`.

The core rule does not understand TypeScript constructs and will trigger false positives on:

* Enums (e.g., `enum Status { Active, Inactive }`)
* Generics / Type parameters (`<T>`)
* Interface & Type declarations

---

### 3. Production Configuration

#### A. Modern Flat Config (`eslint.config.js` / ESLint v9+)

```javascript
// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // 1. Enforce strict rejection of overwriting restricted globals
      'no-shadow-restricted-names': 'error',

      // 2. Disable core ESLint rule (prevents TypeScript false positives)
      'no-shadow': 'off',

      // 3. Enable TypeScript-aware shadowing rule with production tuning
      '@typescript-eslint/no-shadow': [
        'error',
        {
          builtinGlobals: true,             // Flag shadowing of globals like 'fetch', 'event', 'status'
          hoist: 'all',                     // Check both functions and variables
          allow: [                          // Allow harmless conventional callback variable names
            'err',
            'error',
            'res',
            'resolve',
            'reject',
            'next',
            'cb',
            'item',
            'index',
          ],
          ignoreTypeValueShadow: true,      // Allow a type and a const to share a name
          ignoreFunctionTypeParameterNameValueShadow: true, // Allow param names in type definitions
        },
      ],
    },
  },
];

```

#### B. Legacy Configuration (`.eslintrc.cjs` / `.eslintrc.json`)

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-shadow-restricted-names": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": [
      "error",
      {
        "builtinGlobals": true,
        "hoist": "all",
        "allow": ["err", "error", "res", "resolve", "reject", "next", "cb", "item", "index"],
        "ignoreTypeValueShadow": true,
        "ignoreFunctionTypeParameterNameValueShadow": true
      }
    ]
  }
}

```

---

### 4. Key Configuration Options Breakdown

| Option                                                 | Setting                  | Why It Matters in Large Codebases                                                                                                                                      |
| ------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`builtinGlobals: true`**                             | **Recommended (`true`)** | Prevents developers from creating local variables named `status`, `name`, `event`, or `history`, which collide with browser/Node.js globals.                           |
| **`allow: [...]`**                                     | **Whitelist array**      | Prevents alert fatigue for standard async handlers (e.g., `new Promise((resolve, reject) => ...)` or `.catch(err => ...)`).                                            |
| **`ignoreTypeValueShadow: true`**                      | **`true` (TS only)**     | Permits the common TypeScript pattern where a Zod schema or interface shares an identifier with an exported type (`export const User = ...; export type User = ...;`). |
| **`ignoreFunctionTypeParameterNameValueShadow: true`** | **`true` (TS only)**     | Permits type signature parameter names like `type Fetcher = (url: string) => void;` without flagging outer `url` variables.                                            |

---

### 5. Migration Strategy for Legacy Monorepos

If enabling `@typescript-eslint/no-shadow` across a large repository produces hundreds of errors, use a phased adoption workflow:

1. **Step 1: Set to `'warn'` initially** in CI to prevent blocking builds while auditing occurrences.
2. **Step 2: Use ESLint Overrides** to enforce `'error'` strictly on new feature directories while grandfathering legacy folders:

```javascript
{
  files: ['src/features/new-module/**/*.ts'],
  rules: {
    '@typescript-eslint/no-shadow': 'error',
  },
}

```

1. **Step 3: Run automated lint fixes** or apply granular `allow` rules for recurring domain terms before switching the entire repo to `'error'`.
