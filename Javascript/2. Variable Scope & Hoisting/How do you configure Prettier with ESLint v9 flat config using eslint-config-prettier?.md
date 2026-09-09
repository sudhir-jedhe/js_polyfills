***  How do you configure Prettier with ESLint v9 flat config using eslint-config-prettier?.md ***

To configure Prettier with ESLint v9 Flat Config, use **`eslint-config-prettier`** to turn off all ESLint formatting rules that might conflict with Prettier.

---

### 1. Install Dependencies

Install `prettier` and `eslint-config-prettier`:

```bash
npm install --save-dev prettier eslint-config-prettier

```

---

### 2. Configure `eslint.config.mjs` (or `eslint.config.js`)

In Flat Config, import `eslint-config-prettier` and place it as the **last item** in your configuration array so its overrides take precedence over preceding rule sets.

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: ['dist/**', 'coverage/**', 'build/**'],
  },

  // 2. Base & TypeScript Recommended Rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Custom Project Rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // 4. Prettier Config (MUST be at the very end to disable conflicting rules)
  eslintConfigPrettier,
);

```

---

### 3. Set Up Prettier Configuration (`.prettierrc`)

Define formatting rules in a standalone Prettier configuration file:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2
}

```

Add a `.prettierignore` file to mirror your build outputs:

```text
dist
coverage
build
node_modules

```

---

### 4. Configure `package.json` Scripts

Separate code-quality checking (ESLint) from code formatting (Prettier):

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}

```

---

### 5. Verify Conflicts

`eslint-config-prettier` includes a CLI tool to verify that no active ESLint rules conflict with your Prettier setup:

```bash
npx eslint-config-prettier src/index.ts

```

* If configured correctly, the CLI outputs:

```text
No rules that are unnecessary or conflict with Prettier were found.

```

---

### Best Practice: Avoid `eslint-plugin-prettier`

Do **not** use `eslint-plugin-prettier` (running Prettier as an ESLint rule). Running Prettier inside ESLint slows down linting, pollutes ESLint output with stylistic red squigglies, and mixes code quality errors with formatting issues.

Let ESLint handle **code structure and quality**, and let Prettier handle **pure formatting**.
