**npm vs npx vs yarn vs pnpm**

| Feature / Dimension      | npm (Node Package Manager)                | npx (Node Package Execute)            | Yarn (Classic / Berry)                              | pnpm (Performant npm)                                              |
| ------------------------ | ----------------------------------------- | ------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **Primary Role**         | Package manager (install, publish, audit) | Package runner / CLI execution tool   | Fast, reliable package manager alternative          | Fast, disk space–efficient package manager                         |
| **Storage Architecture** | Hoisted, flattened `node_modules`         | In-memory / temporary execution cache | Hoisted (Classic) or Plug'n'Play (Berry `.pnp.cjs`) | Content-addressable global store (`~/.pnpm-store`) with hard links |
| **Disk Efficiency**      | Low (duplicates packages across repos)    | N/A (cleans up after execution)       | Low (Classic) / High (Berry PnP)                    | Highest (one shared copy per version across the whole disk)        |
| **Phantom Dependencies** | Vulnerable (due to hoisting)              | N/A                                   | Vulnerable in Classic; Solved in Berry PnP          | Strictly prevented (isolated symlinks)                             |
| **Installation Speed**   | Standard                                  | Fast (fetches on-demand)              | Fast (caching & parallel downloads)                 | Fastest (hard-linking avoids repeated disk I/O)                    |
| **Default Inclusion**    | Pre-bundled with Node.js                  | Pre-bundled with npm (v5.2+)          | Requires standalone install (`corepack` / `npm`)    | Requires standalone install (`corepack` / `npm`)                   |

---

**Detailed Breakdown**

* **npm**: Default choice across Node.js environments. Uses flat hoisting where dependencies are placed at the root `node_modules`, which can cause phantom dependency bugs.
* **npx**: Executes npm binaries directly without permanent installation (e.g., `npx create-react-app app` or running one-off scripts).
* **Yarn**:
* *Classic (v1)*: Introduced deterministic lockfiles and parallel installation before npm adopted them.
* *Berry (v2+)*: Introduces **Plug’n’Play (PnP)**, removing `node_modules` entirely by using a `.pnp.cjs` map for zero-install instant boots.

* **pnpm**: Stores all package files in a single global content-addressable store. Local project directories only contain hard links and symlinks, saving gigabytes of disk space and strictly preventing imports of undeclared transitive dependencies.
