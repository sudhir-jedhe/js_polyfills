***  How do you properly configure no-unused-vars and no-undef with typescript-eslint to avoid false positives?.md ***

To configure `no-unused-vars` and `no-undef` properly in TypeScript projects, the general rule is: **turn off the core ESLint rules and let TypeScript (via compiler flags and `@typescript-eslint`) handle them**.

The core ESLint versions do not understand TypeScript features like interfaces, type annotations, enums, or ambient global declarations, resulting in frequent false positives and false negatives.

---

### Recommended Setup

#### Flat Config (`eslint.config.js` / ESLint v9+)

```javascript
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // ------------------------------------------------------------
      // 1. no-undef: DISABLE completely for TypeScript files
      // ------------------------------------------------------------
      'no-undef': 'off',

      // ------------------------------------------------------------
      // 2. no-unused-vars: Disable core rule, enable TS extension rule
      // ------------------------------------------------------------
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

```

#### Legacy Config (`.eslintrc.cjs` / `.eslintrc.json`)

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-undef": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  }
}

```

---

### Why Disable `no-undef` Completely?

In TypeScript, `no-undef` produces false positives because ESLint cannot resolve:

* Global types and interfaces (`NodeJS.ProcessEnv`, `Express.Request`)
* Ambient declarations (`declare const __DEV__: boolean;`)
* Type definitions from `@types/*` packages

The TypeScript compiler (`tsc`) natively checks for undefined variables as part of its standard type-checking process (`TS2304: Cannot find name 'x'`). Running `no-undef` alongside `tsc` is redundant and error-prone.

---

### Key Options for `@typescript-eslint/no-unused-vars`

| Option                                     | Setting | Why It Matters                                                                                |
| ------------------------------------------ | ------- | --------------------------------------------------------------------------------------------- |
| **`argsIgnorePattern: '^_'`**              | `^_`    | Allows unused parameters required by signatures/callbacks (e.g., `(_req, res) => ...`).       |
| **`varsIgnorePattern: '^_'`**              | `^_`    | Lets you prefix intentionally unused local bindings with an underscore (`_unusedValue`).      |
| **`caughtErrorsIgnorePattern: '^_'`**      | `^_`    | Allows ignoring errors in catch blocks (`catch (_err) { ... }`).                              |
| **`destructuredArrayIgnorePattern: '^_'`** | `^_`    | Allows positional skipping in array destructuring (e.g., `const [_first, second] = list;`).   |
| **`ignoreRestSiblings: true`**             | `true`  | Allows omitting properties from objects using rest destructuring without triggering warnings. |

---

### Common Patterns Enabled by This Config

**1. Omitting Properties via Rest Destructuring (`ignoreRestSiblings: true`):**

```typescript
// `password` is extracted to remove it from `userData`, but never read directly
const { password, ...userData } = req.body;
sendToClient(userData); // ✅ Allowed

```

**2. Required Signature Parameters with Leading Underscore:**

```typescript
// Callback requires 3 arguments per interface contract, but only index is needed
items.map((_item, index) => index * 2); // ✅ Allowed

```

---

### Complementary `tsconfig.json` Settings

To align `tsc` behavior with your ESLint rules:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

```

> **Note:** If you enable `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`, `tsc` will fail builds on unused variables during compilation. Many teams prefer enforcing this strictly in ESLint (`@typescript-eslint/no-unused-vars`) so that early development and prototyping aren't blocked by TypeScript compiler errors on every save.