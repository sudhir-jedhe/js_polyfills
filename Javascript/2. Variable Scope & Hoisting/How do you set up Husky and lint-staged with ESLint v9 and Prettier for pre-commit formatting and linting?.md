*** copy How do you set up Husky and lint-staged with ESLint v9 and Prettier for pre-commit formatting and linting?.md ***

Setting up **Husky** and **lint-staged** automates code quality checks by ensuring only staged files are formatted with Prettier and linted with ESLint before any Git commit succeeds.

---

### Step-by-Step Setup

1. **Install Husky and lint-staged:**
Install `husky` and `lint-staged` as development dependencies.

```bash
npm install --save-dev husky lint-staged

```

1. **Initialize Husky:**
Initialize Husky to create the `.husky/` directory and configure the Git hooks path.

```bash
npx husky init

```

This command adds a `"prepare": "husky"` script to `package.json` and creates a default `.husky/pre-commit` file.

1. **Configure lint-staged:**
Create a `.lintstagedrc.json` (or `.lintstagedrc.mjs`) configuration file in the project root.

```json
{
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix"
  ],
  "*.{json,css,scss,md,html,yml,yaml}": [
    "prettier --write"
  ]
}

```

1. **Update the pre-commit Git Hook:**
Edit `.husky/pre-commit` to invoke `lint-staged` instead of running full project checks.

```bash
npx lint-staged

```

---

### Understanding the Execution Order in `lint-staged`

When defining tasks for `*.{js,jsx,ts,tsx}`, execution order matters:

1. **`prettier --write` runs first:** Standardizes formatting (spacing, quotes, semicolons).
2. **`eslint --fix` runs second:** Applies ESLint code fixes (e.g., auto-removing unused imports or fixing logic issues). If ESLint throws an unfixable error (such as a syntax error or a broken rule), the commit is aborted immediately.

---

### Advanced Configuration: Type-Checking in Pre-Commit

`tsc` (the TypeScript compiler) cannot check only staged files in isolation because type verification requires the entire project dependency graph.

If you want to enforce type safety on pre-commit, add `tsc --noEmit` as a standalone step in `.husky/pre-commit` before `lint-staged`:

```bash
#!/usr/bin/env sh

# 1. Full-project type check (fast in incremental mode)
npx tsc --noEmit

# 2. Staged files formatting and lint-fixing
npx lint-staged

```

---

### Recommended `package.json` Setup

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}

```

---

### Verification: Testing the Pre-Commit Hook

1. Make a deliberate formatting issue or introduce an unused variable in a TypeScript file.
2. Stage the file:

```bash
git add src/index.ts

```

1. Attempt to commit:

```bash
git commit -m "test: verify pre-commit hook"

```

1. **Result:** Prettier will reformat the staged file, ESLint will apply fixes, and the cleaned file will be included in the commit automatically.
