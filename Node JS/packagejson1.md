The most critical and frequently asked interview questions covering **`package.json`** and **`package-lock.json`**, categorized by concepts, practical scenarios, and internal mechanics.

---

### Core Concepts & Fundamentals

**1. What is the fundamental difference between `package.json` and `package-lock.json`?**

* **`package.json`**: The human-editable project manifest. It defines project metadata, scripts, and high-level dependency requirements using Semantic Versioning ranges (e.g., `^1.2.0`).
* **`package-lock.json`**: An automatically generated, machine-readable snapshot. It locks the exact versions, transitive dependency tree, download URLs, and cryptographic hashes of every installed package.

**2. Why should `package-lock.json` always be committed to version control (Git)?**

* It guarantees reproducible and deterministic builds across different developer machines, staging servers, and CI/CD environments. Without it, running `npm install` on two different days could fetch different patch/minor versions, causing non-deterministic bugs.

**3. What happens if you delete `package-lock.json` and run `npm install`?**

* npm re-evaluates all SemVer ranges specified in `package.json` from scratch.
* It installs the highest allowed version for every direct and transitive dependency currently available on the registry.
* A brand-new `package-lock.json` is generated, which may contain breaking changes or unexpected minor/patch updates.

**4. What is the difference between `npm install` and `npm ci` regarding lockfiles?**

| Feature | `npm install` | `npm ci` |
| --- | --- | --- |
| **Lockfile Update** | Can update `package-lock.json` if versions drift | Never touches or modifies lockfile |
| **Integrity Enforcement** | Permissive with range variations | Throws a fatal build error if lockfile doesn't match `package.json` |
| **`node_modules`** | Overwrites/adds diff in place | Deletes `node_modules` completely before installing |
| **Target Environment** | Local Development | Continuous Integration / CD Pipelines |

---

### In-Depth `package.json` Fields

**5. What is the purpose of the `"exports"` field versus `"main"`?**

* **`"main"`**: The legacy entry point for CommonJS (`require`).
* **`"exports"`**: Modern Node.js standard providing conditional entry points (CJS vs ESM, TypeScript types) and subpath encapsulation. It completely hides internal private files from being imported by consumers.

**6. What are `"peerDependencies"` and when should you use them?**

* They declare that your package requires a specific host package to function without bundling it directly (e.g., a plugin requiring `react@^18.0.0` or `webpack@^5.0.0`). It avoids duplicate singleton instances in consumer projects.

**7. What is `"sideEffects"` in `package.json`?**

* Used by bundlers (like Webpack, Rollup, Vite) for **Tree Shaking**.
* Setting `"sideEffects": false` indicates that no files execute global side-effects on import, allowing the bundler to safely drop unused exports.

**8. What does `"type": "module"` signify?**

* Instructs Node.js to treat all `.js` files within that package directory as ECMAScript Modules (ESM) instead of CommonJS.

**9. What is `"overrides"` in `package.json`?**

* Enforces replacement of specific nested/transitive dependency versions across the entire project graph (e.g., forcing a vulnerability patch on a transitive dependency without waiting for upstream package updates).

---

### In-Depth `package-lock.json` Mechanics

**10. What are `lockfileVersion` 1, 2, and 3?**

* **`v1` (npm 5 & 6)**: Flattened dependency tree format without complete descriptors.
* **`v2` (npm 7 & 8)**: Backwards-compatible with v1; added support for npm workspaces and the `packages` map containing full disk paths (`node_modules/axios`).
* **`v3` (npm 9+)**: Purely utilizes the `packages` definition map; drops legacy v1 metadata for smaller file sizes and faster parsing.

**11. What is the `integrity` field in `package-lock.json`?**

* A Subresource Integrity (SRI) cryptographic hash (e.g., `sha512-...`).
* npm verifies the downloaded tarball against this hash to guarantee the package has not been tampered with in transit or on the registry (protecting against supply-chain attacks).

**12. How do you resolve Git merge conflicts in `package-lock.json`?**

* **Best Practice:** Do not manually edit the JSON file. Instead:
1. Accept `package.json` conflict resolution manually.
2. Run `npm install` (or `npm install --package-lock-only`) to let the npm engine automatically regenerate a valid, consistent lockfile.
3. Commit the updated `package-lock.json`.



---

### Practical Scenario-Based Questions

**13. Scenario: A teammate runs `npm install` and their `package-lock.json` gets modified unexpectedly without altering `package.json`. Why?**

* The teammate likely has a different version of the npm CLI installed (e.g., npm 8 vs npm 10), which causes lockfile format migration (`lockfileVersion: 2` to `3`), or a dependency had an open SemVer range that resolved to a newly released version.

**14. What does the `--package-lock-only` flag do?**

* `npm install --package-lock-only` resolves dependencies and updates/generates `package-lock.json` without downloading or writing files into the local `node_modules` folder (useful in CI caching pipelines).

**15. What is the difference between `npm shrinkwrap` and `package-lock.json`?**

* `package-lock.json` is ignored by npm when published to the public registry.
* `npm-shrinkwrap.json` is publishable to the registry, allowing command-line tools or libraries to enforce exact sub-dependency trees directly on end-users.