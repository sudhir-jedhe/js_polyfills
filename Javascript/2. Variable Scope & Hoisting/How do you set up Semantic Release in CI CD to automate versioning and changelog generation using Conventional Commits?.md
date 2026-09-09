***  How do you set up Semantic Release in CI CD to automate versioning and changelog generation using Conventional Commits?.md ***

**Semantic Release** fully automates the release workflow by analyzing commit messages pushed to your default branch. It determines the next **SemVer** bump (`major`, `minor`, `patch`), generates a `CHANGELOG.md`, tags the commit in Git, publishes to package registries (like npm), and creates a GitHub/GitLab release with release notes.

---

### How Semantic Release Maps Commits to SemVer

| Commit Type            | Example Commit                              | SemVer Bump | Result (from `1.0.0`) |
| ---------------------- | ------------------------------------------- | ----------- | --------------------- |
| **`fix:`**             | `fix(auth): handle expired token edge case` | **Patch**   | `1.0.1`               |
| **`feat:`**            | `feat(api): add export to CSV endpoint`     | **Minor**   | `1.1.0`               |
| **`BREAKING CHANGE:`** | `feat: drop support for Node 18`<br>        |

<br>`BREAKING CHANGE: Minimum supported Node is 20` | **Major** | `2.0.0` |
| **`docs:`, `chore:`, `refactor:`, `test:`, `ci:**` | `docs: update deployment instructions` | **No release** | *Skipped* |

---

### Step-by-Step Configuration

1. **Install Semantic Release & Standard Plugins:**
Install `semantic-release` and its standard plugin suite as development dependencies:

```bash
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github @semantic-release/npm

```

1. **Create Configuration File (.releaserc.json):**
Create a `.releaserc.json` (or `release.config.mjs`) in the root directory:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/npm",
      {
        "npmPublish": true
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}

```

1. **Set Up Repository Secrets & Tokens:**
Configure the following secrets in your CI/CD repository settings (e.g., GitHub Settings $\rightarrow$ Secrets and Variables $\rightarrow$ Actions):

* **`GITHUB_TOKEN`** (or `GH_TOKEN` / Personal Access Token): Needs `contents: write` and `issues: write` permissions.
* **`NPM_TOKEN`**: Required if publishing to npm (can set `"npmPublish": false` in the npm plugin configuration if your repository is a private application).

1. **Create the CI/CD Pipeline Workflow:**
Create `.github/workflows/release.yml` for GitHub Actions.

---

### GitHub Actions Workflow (`.github/workflows/release.yml`)

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write # Needed to create Git tags, commit CHANGELOG.md, and create releases
  issues: write   # Needed for comment/label generation on resolved issues
  pull-requests: write

jobs:
  release:
    name: Release & Publish
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full Git history is required for commit-analyzer to parse all tags

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Build & Tests
        run: |
          npm run test
          npm run build --if-present

      - name: Run Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release

```

---

### Plugin Execution Pipeline Explained

The order of plugins in `.releaserc.json` determines the execution lifecycle:

1. **`@semantic-release/commit-analyzer`**: Scans all commits since the last Git tag and computes the release type (`major`, `minor`, `patch`).
2. **`@semantic-release/release-notes-generator`**: Parses commit scopes, descriptions, and PR references into structured release notes.
3. **`@semantic-release/changelog`**: Prepends the generated release notes to `CHANGELOG.md`.
4. **`@semantic-release/npm`**: Updates `version` in `package.json` and publishes the package to npm.
5. **`@semantic-release/git`**: Commits the modified `CHANGELOG.md` and `package.json` back to the `main` branch with `[skip ci]` to prevent infinite CI loops.
6. **`@semantic-release/github`**: Creates a formal GitHub Release tag, uploads build assets (if configured), and leaves automated comments on PRs/Issues resolved by this release.

---

### Handling Pre-Releases & Beta Channels

To manage `beta` or `next` versions alongside `main`, configure multi-branch targets:

```json
{
  "branches": [
    "main",
    {
      "name": "beta",
      "prerelease": true
    },
    {
      "name": "next",
      "prerelease": true
    }
  ]
}

```

* Commits to `beta` will create versions like `1.1.0-beta.1`.
* Merging `beta` into `main` automatically promotes it to the official `1.1.0` release.
