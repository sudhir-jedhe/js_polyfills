*** copy How do you configure Commitlint with Husky to enforce Conventional Commits?.md ***

Setting up **Commitlint** with **Husky** validates Git commit messages locally, ensuring they follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: add user login`, `fix(api): handle timeout`).

---

### Step-by-Step Configuration

1. **Install Commitlint CLI & Conventional Config:**
Install the Commitlint CLI and the standard conventional commit rule preset as development dependencies:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

```

1. **Create the Commitlint Configuration File:**
Create a `commitlint.config.mjs` (or `.commitlintrc.json`) file in the root directory:

```javascript
// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Optional custom rule overrides
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Formatting, missing semicolons, etc. (no code change)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding or updating tests
        'build',    // Build system or external dependency updates
        'ci',       // CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test files
        'revert',   // Reverting a previous commit
      ],
    ],
    'subject-case': [0], // Disable case check if you allow Jira tickets (e.g., feat: PROJ-123)
  },
};

```

1. **Add the commit-msg Hook to Husky:**
Create the `commit-msg` hook inside the `.husky/` directory:

```bash
# Husky v9+ (modern setup):
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg

```

*(If using Windows PowerShell or manual creation, ensure `.husky/commit-msg` contains):*

```bash
npx --no -- commitlint --edit "$1"

```

1. **Ensure Script Permissions (Linux/macOS):**
Make sure the hook script is executable:

```bash
chmod +x .husky/commit-msg

```

---

### Anatomy of a Valid Conventional Commit

Commit messages must match this pattern:

$$\text{type(optional scope): description}$$

```text
feat(auth): add OAuth2 refresh token handling
fix(ui): resolve button clipping on mobile viewport
docs: update setup instructions in README
chore(deps): bump @typescript-eslint/parser from 8.0 to 8.1

```

---

### Verification: Testing the Hook

#### 1. Test an Invalid Commit (Should Fail)

```bash
git commit -m "fixed stuff"

```

**Output:**

```text
⧗   input: fixed stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 errors, 0 warnings
husky - commit-msg script failed (code 1)

```

#### 2. Test a Valid Commit (Should Succeed)

```bash
git commit -m "fix(auth): correct token expiry validation"

```

**Output:**

```text
[main 4a8b1c2] fix(auth): correct token expiry validation
 1 file changed, 2 insertions(+)

```

---

### Key Commitlint Rules Reference

| Rule                    | Meaning                                         | Recommended Value                          |
| ----------------------- | ----------------------------------------------- | ------------------------------------------ |
| **`type-enum`**         | Allowed commit prefixes                         | `['feat', 'fix', 'docs', 'refactor', ...]` |
| **`type-case`**         | Case requirement for the type                   | `[2, 'always', 'lower-case']`              |
| **`type-empty`**        | Disallows committing without a type prefix      | `[2, 'never']`                             |
| **`subject-empty`**     | Requires a message description after the colon  | `[2, 'never']`                             |
| **`header-max-length`** | Enforces maximum line length for the first line | `[2, 'always', 100]`                       |
