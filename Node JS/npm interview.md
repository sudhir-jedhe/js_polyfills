Top npm interview questions categorized by core concepts, dependency types, versioning rules, and build pipeline commands.

---

### 1. `dependencies` vs `devDependencies` vs `peerDependencies`

| Dependency Type            | Flag                     | Purpose & Environment                                                                                                                                |
| -------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`dependencies`**         | `--save` / `-S`          | Packages required for the application to run in **production** (e.g., `react`, `express`, `lodash`).                                                 |
| **`devDependencies`**      | `--save-dev` / `-D`      | Packages needed only during **local development and build/testing** (e.g., `typescript`, `eslint`, `jest`, `vite`).                                  |
| **`peerDependencies`**     | Manually declared        | Specifies that a package requires a specific host package version to function without bundling it directly (common in plugins, component libraries). |
| **`optionalDependencies`** | `--save-optional` / `-O` | Packages that won't fail the build if installation fails (useful for platform-specific native addons).                                               |

---

### 2. `npm install` vs `npm ci`

```bash
# npm install (Development)
npm install

# npm ci (Continuous Integration / Production Pipelines)
npm ci

```

* **`npm install`**: Reads `package.json`, updates `package-lock.json` if ranges allow higher versions, and installs dependencies.
* **`npm ci` (Clean Install)**:
* Strictly requires an existing `package-lock.json` matching `package.json`.
* Deletes `node_modules` before installing.
* Never modifies `package-lock.json` or `package.json`.
* Runs faster and guarantees deterministic, reproducible builds across CI/CD environments.

---

### 3. Purpose of `package-lock.json`

* **Deterministic Dependency Tree**: Locks exact versions, transitive child dependencies, and integrity hashes (`sha512` hashes).
* **Prevents "Works on My Machine"**: Ensures every team member and deployment server resolves identical dependency snapshots regardless of semver update windows.

---

### 4. Semantic Versioning (SemVer) Prefixes

Given package version `1.2.3` (`MAJOR.MINOR.PATCH`):

* **Tilde (`~1.2.3`)**: Accepts **patch** updates only $\to$ `~1.2.3` matches `>= 1.2.3 < 1.3.0`.
* **Caret (`^1.2.3`)**: Accepts **minor and patch** updates without breaking changes $\to$ `^1.2.3` matches `>= 1.2.3 < 2.0.0`.
* **Exact (`1.2.3`)**: Installs only version `1.2.3`.
* **Asterisk (`*`)**: Accepts any version (including major breaking changes).

---

### 5. `npx` vs `npm`

* **`npm`**: Package manager used to install, uninstall, publish, and manage dependencies locally or globally.
* **`npx` (Node Package Execute)**: CLI tool bundled with npm (v5.2+) to execute npm binaries directly without installing them globally:

```bash
# Executes create-react-app without global npm install
npx create-react-app my-app

```

---

### 6. Managing Vulnerabilities & Auditing

* **`npm audit`**: Scans the project dependency tree for known security vulnerabilities.
* **`npm audit fix`**: Automatically updates vulnerable transitive dependencies to compatible semver versions.
* **`npm audit fix --force`**: Upgrades top-level packages to newer major versions that fix vulnerabilities (can introduce breaking changes).

---

### 7. Global vs Local Packages

* **Local installation (`npm i <pkg>`)**: Installs under `./node_modules` of the current project directory. Accessible via local scripts inside `package.json`.
* **Global installation (`npm i -g <pkg>`)**: Installs to system-wide directories, making executable binaries accessible globally via system terminal commands (e.g., `nodemon`, `pm2`).

---

### 8. Common NPM CLI Commands Quick Reference

* **`npm outdated`**: Checks registry to see if any installed packages are outdated.
* **`npm link`**: Symlinks a local package folder to test local libraries across projects without publishing.
* **`npm prune`**: Removes packages in `node_modules` that are not listed in `package.json`.
* **`npm cache clean --force`**: Purges the global npm download cache.

A comprehensive compilation of 50 in-depth **npm (Node Package Manager)** interview questions and answers, organized by domain.

---

### Core Architecture & Fundamentals

**1. What is npm and what are its main components?**

* The npm CLI (the command-line tool).
* The npm Registry (the public database of JavaScript packages).
* The npm Website (web portal for searching packages and managing profiles).

**2. What is the role of `package.json`?**

* Manifest file for Node.js projects holding metadata (name, version, license), script runners, and dependency trees.

**3. What does `npm init -y` do?**

* Generates a default `package.json` file immediately without interactively prompting for fields.

**4. Where are globally installed packages stored?**

* Can be checked using `npm root -g`. In Unix: `/usr/local/lib/node_modules` or `~/.nvm/...`; in Windows: `%AppData%\npm\node_modules`.

**5. How does npm resolve package execution in npm scripts?**

* When running `npm run <script>`, npm automatically prefixes the system `PATH` with `./node_modules/.bin`, allowing direct access to locally installed CLI binaries without global installation.

**6. What is the difference between `npm start` / `npm test` and custom scripts?**

* Standard lifecycle scripts (`start`, `test`, `stop`, `restart`) can be executed as `npm start` or `npm test`. Custom scripts require the `run` keyword (`npm run build`).

**7. What is `npm dedupe`?**

* Searches the local dependency tree and moves shared sub-dependencies to the top-level `node_modules` folder to reduce disk duplication.

**8. What does `npm ls` (or `npm list`) do?**

* Prints a tree view of all installed packages and their sub-dependencies. Adding `--depth=0` limits output to direct dependencies only.

**9. What is `npm doctor`?**

* Runs a series of diagnostic checks on the environment to ensure the npm installation, git configuration, and cache integrity are healthy.

**10. What is `bundledDependencies` in `package.json`?**

* An array of package names bundled directly into the tarball when publishing using `npm pack` or `npm publish`, ensuring consumers receive them without separate registry installation.

---

### Dependency Management & Versioning

**11. What is `overrides` (or `resolutions`) in `package.json`?**

* Forces npm (v8.3+) to replace a specific nested transitive dependency across the entire dependency graph with a specified version (useful for fixing security vulnerabilities in sub-packages).

**12. What does SemVer `0.x.x` versioning mean with `^` and `~`?**

* In `0.x.x` (pre-1.0.0), breaking changes can happen in minor versions:
* `^0.2.3` locks to `>=0.2.3 <0.3.0`.
* `^0.0.3` locks strictly to `0.0.3`.

**13. What is the difference between `npm update` and `npm install`?**

* `npm install` installs missing dependencies based on `package-lock.json`.
* `npm update` checks registry and updates dependencies up to the maximum version allowed by SemVer prefixes in `package.json`, then rewrites `package-lock.json`.

**14. What is `npm pack`?**

* Creates a `.tgz` compressed tarball archive from the package exactly as it would be published to the registry.

**15. What is the difference between installing via Git URL vs Registry?**

* `npm i user/repo#branch`: Pulls source code directly from GitHub, building it locally if needed.
* Registry installation pulls pre-built distribution assets published to `registry.npmjs.org`.

**16. What is `npm explain <pkg>`?**

* Diagnoses why a specific package or version is present in `node_modules`, showing its exact dependency ancestor chain.

**17. How do you install an exact version without semver prefixes?**

* Use `--save-exact` or `-E` (`npm i lodash --save-exact`).

**18. What are Git dependency prefixes (`git+https`, `git+ssh`, `github:`)?**

* Allows pointing dependencies directly to Git tags, commit SHAs, or custom branch releases instead of SemVer versions.

**19. What is `npm ping`?**

* Pings the configured registry URL to verify connection health and latency.

**20. What is `npm view <package> versions`?**

* Fetches and displays all published versions of a given package from the remote registry without installing it.

---

### Security & CI/CD Pipelines

**21. What are integrity hashes in `package-lock.json`?**

* Subresource integrity strings (e.g., `sha512-...`) ensuring that the tarball downloaded from the registry has not been tampered with or corrupted.

**22. How do you run `npm audit` in CI without breaking builds for low-level warnings?**

* Use the severity flag: `npm audit --audit-level=high` or `--audit-level=critical`.

**23. What is `.npmrc` and what are its priority levels?**

* Config file for npm settings. Order of resolution:

1. Project-level (`/path/to/project/.npmrc`)
2. User-level (`~/.npmrc`)
3. Global-level (`$PREFIX/etc/npmrc`)
4. Built-in npm defaults.

**24. How do you authenticate with private registries (like Nexus, JFrog, GitHub Packages) in `.npmrc`?**

* Set scoped registry and auth token tokens:

```ini
@my-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

```

**25. What is the difference between `--production` and `NODE_ENV=production` during `npm i`?**

* Both prevent npm from installing `devDependencies`, keeping production images lean.

**26. How do you ignore lifecycle scripts during install for security?**

* `npm install --ignore-scripts` (prevents malicious postinstall binary executions).

**27. What is `npm shrinkwrap`?**

* Creates `npm-shrinkwrap.json` (identical to `package-lock.json`), but can be published to the registry for libraries to lock exact sub-dependencies for consumers.

**28. How do you fix permission errors without `sudo npm install -g`?**

* Reconfigure npm's default directory to a home folder directory via `npm config set prefix '~/.npm-global'`.

**29. What is `npm cache verify`?**

* Validates cache content, garbage collects unreferenced data, and verifies the integrity of the cache index.

**30. How does npm handle supply-chain 2FA on publishing?**

* Enforces `--otp=123456` during `npm publish` for multi-factor authenticated developer accounts.

---

### Scripts, Workspaces & Advanced CLI

**31. What are `pre` and `post` lifecycle scripts in npm?**

* Scripts prefixed with `pre` or `post` execute automatically before and after the target script (e.g., `prebuild` runs before `build`, `postbuild` runs after `build`).

**32. How do you pass arguments to npm scripts?**

* Use `--` delimiter:

```bash
npm run test -- --watch --coverage

```

**33. What are npm Workspaces?**

* A built-in monorepo management feature (npm v7+) that manages multiple packages under a single root project, sharing a root `node_modules` via symlinks.

**34. How do you run a command in a specific workspace?**

* `npm run build --workspace=<package-name>` or `-w <package-name>`.

**35. What is `npm link` and how does it work internally?**

* Creates a global symlink in the system folder for a local package, then links that symlink into another local project's `node_modules` for local testing.

**36. How do you unlink an `npm link` package?**

* Run `npm unlink --no-save <pkg-name>` inside the consumer project.

**37. What does `npm version <major|minor|patch>` do?**

* Bumps the version in `package.json` and `package-lock.json`, commits the change, and creates a Git tag automatically.

**38. What is `npm exec`?**

* The underlying command for `npx`, executing binaries from local or remote packages.

**39. What is `npm diff`?**

* Compares changes between different published package versions or between local source code and registry versions.

**40. What is `npm find-dupes`?**

* Scans `node_modules` and reports duplicate packages that can be deduplicated.

---

### Publishing & Package Distribution

**41. What is the `.npmignore` file?**

* Specifies files to exclude when packaging and publishing to the registry (if omitted, npm falls back to `.gitignore`).

**42. How does `files` in `package.json` interact with `.npmignore`?**

* The `files` field is an allowlist array. When declared, only specified files/directories are included in the build tarball, taking precedence over ignore rules.

**43. What is the purpose of `"private": true` in `package.json`?**

* Prevents accidental publishing of proprietary repositories to the public npm registry.

**44. What are npm distribution tags (`dist-tag`)?**

* Pointers to specific package versions (e.g., `latest`, `beta`, `next`, `canary`):

```bash
npm publish --tag beta
npm i my-pkg@beta

```

**45. What is a Scoped Package (e.g., `@angular/core`, `@types/node`)?**

* Packages namespaced under an organization or user handle prefixed with `@`. Scoped packages are private by default upon first publish unless `--access public` is passed.

**46. What are `"exports"` and `"main"` fields in `package.json`?**

* `"main"`: Legacy CommonJS entry point file.
* `"exports"`: Modern Node.js standard providing conditional entry points (CJS vs ESM via `import`/`require`, types resolution, subpath encapsulation).

**47. What is `"type": "module"` in `package.json`?**

* Instructs Node.js runtime to treat all `.js` files in that package directory as ECMAScript Modules (ESM) rather than CommonJS.

**48. What is `npm unpublish` policy?**

* npm allows unpublishing a package version only within 72 hours of initial release (provided no other registry packages depend on it), to prevent breaking global ecosystems (the "left-pad" incident policy).

**49. What is `npm deprecate <pkg> "message"`?**

* Marks a specific version or range as deprecated on the registry with a warning message without deleting the code.

**50. What is the difference between npm, Yarn, and pnpm?**

* **npm**: Uses flattened `node_modules` with hoisting.
* **Yarn (Classic / Berry)**: Introduces Zero-installs and Plug'n'Play (`.pnp.cjs`) to eliminate `node_modules`.
* **pnpm**: Uses a content-addressable global hard-link store with isolated symlinked `node_modules`, preventing phantom dependencies and saving disk space.

A comprehensive, deep-dive technical breakdown of the most critical **npm concepts, mechanisms, and internal architectures** frequently evaluated in Senior and Lead Frontend/Node.js interviews.

---

### 1. `node_modules` Resolution & Hoisting

npm uses **hoisting** to flatten the dependency tree and prevent duplicate packages:

* **Internal Mechanism:** When Package A requires `lodash@4` and Package B requires `lodash@4`, npm hoists `lodash` to the root `./node_modules/lodash`. Both packages resolve it up the directory tree via Node's module resolution algorithm.
* **The "Phantom Dependency" Problem:** Because dependencies are hoisted to the root `node_modules`, your application code can `import` a package that is **not** declared in your `package.json` simply because a sub-dependency installed it. If that sub-dependency removes it in a future update, your build will break.
* **Version Collisions:** If Package A requires `lodash@4` and Package B requires `lodash@3`, one is hoisted to the root and the conflicting version is nested inside `./node_modules/PackageB/node_modules/lodash`.

```text
node_modules/
├── lodash/ (v4.17.21 - Hoisted)
├── package-a/
└── package-b/
    └── node_modules/
        └── lodash/ (v3.10.1 - Nested due to conflict)

```

---

### 2. Lockfile Deep Dive: `lockfileVersion` Formats

The `package-lock.json` file contains exact metadata, resolved URLs, and cryptographic signatures:

* **`lockfileVersion: 1` (npm v5 & v6):** Basic flat dependency tree without complete hoisting descriptors.
* **`lockfileVersion: 2` (npm v7 & v8):** Backwards-compatible with v1, introduces the `packages` map containing full disk paths (`node_modules/react`) and workspaces support.
* **`lockfileVersion: 3` (npm v9+):** Drops legacy v1 metadata entirely, relying solely on the hidden `packages` object for faster installations and reduced file sizes.

**Integrity Verification:**

```json
"node_modules/axios": {
  "version": "1.6.8",
  "resolved": "https://registry.npmjs.org/axios/-/axios-1.6.8.tgz",
  "integrity": "sha512-v/ZLmJAKUvDoSmBUBi/BKroBp30RNbnyNa4JZPhCi3R2Gw/da3NI32cx11XMKZK2WbVcJ3LFD6PN0lDJEbG7ZQ=="
}

```

* The `integrity` field uses a Subresource Integrity (SRI) base64 hash (`sha512`). If the package binary is altered on the registry or proxy, npm rejects the download.

---

### 3. Comprehensive SemVer Specification (RFC 3986)

Semantic Versioning uses the format: `MAJOR.MINOR.PATCH-PRERELEASE+BUILD`

```text
       1   .   2   .   3   -   beta.1  +  20260824
       ┬       ┬       ┬         ┬          ┬
     MAJOR   MINOR   PATCH   PRERELEASE   BUILD METADATA

```

| Operator           | Syntax Example  | Resolved Version Range                                          |
| ------------------ | --------------- | --------------------------------------------------------------- |
| **Exact**          | `1.2.3`         | Matches `1.2.3` only                                            |
| **Caret (`^`)**    | `^1.2.3`        | `>=1.2.3 <2.0.0` (Allows backwards-compatible Minor/Patch)      |
| **Tilde (`~`)**    | `~1.2.3`        | `>=1.2.3 <1.3.0` (Allows Patch only)                            |
| **Pre-1.0 Caret**  | `^0.2.3`        | `>=0.2.3 <0.3.0` (In `0.x`, Minor can contain breaking changes) |
| **Pre-0.1 Caret**  | `^0.0.3`        | `0.0.3` only (In `0.0.x`, Patch can contain breaking changes)   |
| **Hyphen Range**   | `1.0.0 - 2.1.0` | `>=1.0.0 <=2.1.0`                                               |
| **Wildcard (`*`)** | `1.x` or `*`    | Any matching version                                            |

---

### 4. Enterprise Private Registry Setup (`.npmrc`)

Enterprise pipelines enforce custom package routing and authentication scopes via `.npmrc`:

```ini
# Route all @myorg scoped packages to private GitHub Packages registry
@myorg:registry=https://npm.pkg.github.com

# Route standard open-source packages to Artifactory/Nexus mirror
registry=https://artifactory.internal.company.com/artifactory/api/npm/npm-virtual/

# Always require 2FA and strict SSL verification
strict-ssl=true
always-auth=true

# Inject pipeline environment secret tokens
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

```

---

### 5. Dual-Module Publishing (`CommonJS` + `ESM`)

Modern npm libraries must support both `require()` (CJS) and `import` (ESM) using conditional exports in `package.json`:

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./subpath": {
      "types": "./dist/subpath.d.ts",
      "import": "./dist/subpath.mjs",
      "require": "./dist/subpath.cjs"
    }
  },
  "files": [
    "dist",
    "README.md"
  ]
}

```

* **`"exports"` encapsulation:** Files not declared inside `"exports"` cannot be accessed by consumers, preventing unauthorized imports of internal files (`import helper from 'my-library/dist/internal/helper.js'` will throw an error).

---

### 6. Package Manager Architecture: `npm` vs `yarn` vs `pnpm`

```text
npm (Hoisted)         Yarn PnP (No node_modules)      pnpm (Content-Addressable)
 node_modules/         .pnp.cjs (Lookup Table)        .pnpm/ (Global Hard-link Store)
 ├── pkg-a/            (Resolves in-memory,            ├── pkg-a@1.0.0 (Hard link)
 └── pkg-b/             no disk generation)           node_modules/
                                                      └── pkg-a -> symlink to .pnpm

```

* **npm (v7+):** Uses hoisted tree layout. Slower disk I/O on large multi-app repos; vulnerable to phantom dependencies.
* **Yarn Plug'n'Play (PnP):** Generates `.pnp.cjs` mapping table instead of writing millions of files into `node_modules`, achieving zero-install cold boots.
* **pnpm (Performant npm):** Uses a single global storage folder (`~/.pnpm-store`). Local `node_modules` contain only symlinks pointing to hard-links in the store, guaranteeing:
* Zero disk space duplication across projects.
* Strict isolation: only explicitly declared dependencies appear in `./node_modules`.

---

### 7. Dependency Overrides & Patching Transitive Bugs

When a deeply nested sub-dependency has a critical security vulnerability and the parent maintainer has not published a fix, use `overrides`:

```json
{
  "dependencies": {
    "react-scripts": "5.0.1"
  },
  "overrides": {
    "nth-check": "^2.1.1",
    "react-scripts": {
      "typescript": "^5.0.0"
    }
  }
}

```

* Forces npm to ignore the version declared by `react-scripts` and install `nth-check@^2.1.1` across every branch of the dependency graph.

Introduction to packages and modules
About the public npm registry
About packages and modules
About scopes
About public packages
About private packages
npm package scope, access level, and visibility
Contributing packages to the registry
Creating a package.json file
Creating Node.js modules
About package README files
Creating and publishing unscoped public packages
Creating and publishing scoped public packages
Creating and publishing private packages
Package name guidelines
Specifying dependencies and devDependencies in a package.json file
About semantic versioning
Adding dist-tags to packages
Updating and managing your published packages
Changing package visibility
Adding collaborators to private packages owned by a user account
Updating your published package version number
Deprecating and undeprecating packages or package versions
Transferring a package from a user account to another user account
Unpublishing packages from the registry
Getting packages from the registry
Searching for and choosing packages to download
Downloading and installing packages locally
Downloading and installing packages globally
Resolving EACCES permissions errors when installing packages globally
Updating packages downloaded from the registry
Using npm packages in your projects
Using deprecated packages
Uninstalling packages and dependencies
Securing your code
About audit reports
Auditing package dependencies for security vulnerabilities
Generating provenance statements

## Packages, Modules, Scopes, and Visibility

**Packages vs. Modules**

* **Package:** A directory containing a valid `package.json` file and the code described by it. When published to npm, it is packaged as a gzipped tarball (`.tgz`).
* **Module:** Any file or directory within `node_modules` that can be loaded using Node.js's `require()` or `import`. To be a module, it must expose entry points (via `main`, `exports`, or `index.js`).
* *Relationship:* Almost all npm packages are modules, but not all modules are packages (e.g., built-in Node modules like `fs` or `path`).

**The Public npm Registry**

* A centralized database of JavaScript software, metadata, and dependencies.
* Accessible via the npm CLI, npm website, and the REST API (`[https://registry.npmjs.org](https://registry.npmjs.org)`).

**Package Scopes, Access Levels, and Visibility**

* **Unscoped Packages:** Named directly (e.g., `lodash`). They reside in the global namespace and are always **public**.
* **Scoped Packages:** Prefixed with a user or organization name (e.g., `@my-org/core`, `@username/utils`).
* **Visibility Matrix:**

| Package Type       | Default Access Level | Access Flag on Publish            | Paid Account Required? |
| ------------------ | -------------------- | --------------------------------- | ---------------------- |
| **Unscoped**       | Public               | `npm publish`                     | No                     |
| **Scoped Public**  | Private (by default) | `npm publish --access public`     | No                     |
| **Scoped Private** | Private              | `npm publish --access restricted` | Yes (npm Pro / Teams)  |

---

## Authoring, Building, and Publishing Packages

**Package Name Guidelines**

* Must be URL-safe: entirely lowercase, no leading dots/underscores, no spaces.
* Cannot match existing public package names or core Node.js modules.
* Avoid names that trigger trademark violations or typosquatting flags.

**Creating `package.json` and Entry Points**

* Run `npm init` (interactive) or `npm init -y` (defaults).
* Essential root fields:

```json
{
  "name": "@my-org/math-utils",
  "version": "1.0.0",
  "description": "Fast arithmetic helpers",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "README.md"],
  "publishConfig": {
    "access": "public"
  }
}

```

**Package Documentation (`README.md`)**

* Stored in the root directory.
* Automatically rendered on the package's npm registry landing page to document installation, API interfaces, code examples, and licenses.

**Publishing Workflows**

* **Unscoped Public:**

```bash
npm login
npm publish

```

* **Scoped Public:**

```bash
npm publish --access public

```

* **Scoped Private:**

```bash
npm publish --access restricted

```

---

## Package Lifecycle, Maintenance, and Collaboration

**Updating Versions and SemVer**

* SemVer Format: `MAJOR.MINOR.PATCH`
* `npm version patch`: `1.0.0 -> 1.0.1` (Backwards-compatible bug fixes)
* `npm version minor`: `1.0.0 -> 1.1.0` (Backwards-compatible features)
* `npm version major`: `1.0.0 -> 2.0.0` (Breaking API changes)

* Automatically updates `package.json`, commits the change, and creates a git tag.

**Adding Distribution Tags (`dist-tags`)**

* Tags act as aliases for version numbers:

```bash
# Publish a pre-release under beta tag
npm publish --tag beta

# Add or reassign a tag manually
npm dist-tag add @my-org/math-utils@1.2.0-rc.1 next

# List existing tags
npm dist-tag ls @my-org/math-utils

```

**Collaborator Management & Visibility**

* Add a maintainer:

```bash
npm owner add <username> <package-name>

```

* Change visibility from private to public:

```bash
npm access public <package-name>

```

* Change visibility from public to private:

```bash
npm access restricted <package-name>

```

* Transfer package ownership:

```bash
npm owner add <new-owner> <package-name>
npm owner rm <old-owner> <package-name>

```

**Deprecation and Unpublishing Policies**

* **Deprecating (Recommended):** Displays a warning during installation without breaking existing downstream builds:

```bash
# Deprecate specific version
npm deprecate my-pkg@1.0.0 "Vulnerable version, please update to 1.0.1"

# Undeprecate
npm deprecate my-pkg@1.0.0 ""

```

* **Unpublishing Policy:**
* Allowed only within **72 hours** of publishing if no other registry packages depend on it.
* Once unpublished, that exact version string cannot be republished.

```bash
npm unpublish my-pkg@1.0.0 --force

```

---

## Consuming, Installing, and Managing Dependencies

**Local vs. Global Installation**

* **Local:** Installed under `./node_modules` and recorded in `package.json`:

```bash
# Production runtime dependency
npm install <pkg>

# Development-only dependency
npm install -D <pkg>

```

* **Global:** Installed system-wide for CLI binaries:

```bash
npm install -g <pkg>

```

**Resolving `EACCES` Global Permission Errors**
Do not use `sudo npm install -g`. Instead, reconfigure npm's global prefix to a user-owned directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.bashrc # or ~/.zshrc

```

**Updating and Uninstalling**

```bash
# Check for outdated packages against SemVer rules
npm outdated

# Update dependencies to their latest allowed SemVer version
npm update

# Uninstall local dependency and remove from package.json
npm uninstall <pkg>

# Remove unreferenced node_modules
npm prune

```

---

## Security, Audits, and Supply Chain Provenance

**Audit Reports & Vulnerability Remediation**

* `npm audit`: Scans your dependency tree against the GitHub Advisory Database.
* Output includes severity ratings (Low, Moderate, High, Critical), vulnerable dependency paths, and CVE identifiers.
* Automated fixes:

```bash
# Fixes compatible SemVer ranges
npm audit fix

# Forces major version upgrades across breaking changes
npm audit fix --force

```

**Supply Chain Provenance Statements**

* **What It Is:** Cryptographically signs and verifies that the package published to npm was built directly from a specific public source repository and commit SHA using a trusted CI runner (e.g., GitHub Actions).
* **Generating Provenance:**
Requires publishing inside a supported CI pipeline (like GitHub Actions) with `id-token: write` permissions:

```yaml
name: Publish Package
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Mandatory for OIDC provenance token
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

```

* The npm registry attaches a **"Provenance"** badge with a verifiable Sigstore ledger entry linking the npm artifact directly to the exact source commit and build run.
