In Webpack's architecture, the entire compilation engine is built on **Tapable**—a micro-library that implements a specialized, strongly-typed Publisher/Subscriber (Hook) system.

While the **`Compiler`** represents the long-lived master instance managing the overall build lifecycle, the **`Compilation`** represents a single build of the dependency graph and assets.

The **`seal`** and **`optimize`** phases mark the critical transition from parsing/building modules to optimizing, splitting, and rendering final emitted assets.

---

### 1. High-Level Tapable Execution Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Compiler Execution                                       │
│    • compiler.hooks.compile                                 │
│    • compiler.hooks.make (Build Module Graph)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. compilation.seal() (Freezes Module Graph)                │
│    • compilation.hooks.seal                                 │
│    • Creates Chunks & Chunk Graph                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Optimization Stages (Modules & Chunks)                   │
│    • Module Optimization (Tree-shaking, Scope Hoisting)     │
│    • Chunk Optimization (SplitChunksPlugin)                 │
│    • Module & Chunk ID Assignment ('deterministic')         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Asset Generation & Hashing                               │
│    • compilation.hooks.processAssets (Minification/Terser)  │
│    • compilation.hooks.afterSeal                            │
└─────────────────────────────────────────────────────────────┘

```

---

### 2. The Core Tapable Hook Classes Used

Webpack relies on specific Tapable hook classes to control execution flow:

* **`SyncHook` / `AsyncSeriesHook`:** Executes plugins linearly one by one.
* **`SyncBailHook` / `AsyncSeriesBailHook`:** Halts subsequent taps as soon as a plugin returns a defined (non-undefined) value (e.g., resolving a module format or taking over an asset render).
* **`AsyncParallelHook`:** Triggers multiple asynchronous plugins concurrently and proceeds when all resolve.

---

### 3. Deep Dive: The `compilation.seal()` Lifecycle

Once the `make` hook finishes parsing and compiling all ASTs into modules, `compiler.hooks.compile` calls `compilation.seal()`.

1. **1. Freeze Graph (compilation.hooks.seal):**
No new modules can enter the graph. Webpack initializes the Chunk Graph and maps entry points to initial chunks.

2. **2. Module Optimization Hooks:**
Before chunks are finalized, Webpack optimizes individual modules:

* **`optimizeModules`**: General module-level reductions.
* **`afterOptimizeModules`**: Plugins verify tree-shaking flags (`usedExports`).
* **`ModuleConcatenationPlugin`** executes here to assemble Scope-Hoisted clusters.

1. **3. Chunk Optimization Hooks:**
Modules are grouped into chunks, and the chunk graph is refined:

* **`optimizeChunks`**: **`SplitChunksPlugin`** taps in here to calculate chunk sizes, evaluate `cacheGroups`, and carve out vendor/shared chunks.
* **`afterOptimizeChunks`**: Chunks and entrypoint dependencies are finalized.

1. **4. Deterministic ID Assignment:**
IDs are stabilized to ensure long-term caching:

* **`beforeModuleIds` $\rightarrow$ `optimizeModuleIds**`: Assigns short, collision-resistant hashes (e.g., `optimization.moduleIds: 'deterministic'`).
* **`beforeChunkIds` $\rightarrow$ `optimizeChunkIds**`: Assigns deterministic IDs to chunks.

1. **5. Hash Generation:**

* **`beforeHash` $\rightarrow$ `chunkHash` $\rightarrow$ `afterHash**`: Computes `[contenthash]` and `[fullhash]` by hashing the AST/content of modules and runtime templates in each chunk.

1. **6. Asset Generation & Post-Processing (processAssets):**

* **`processAssets`**: The unified stage for asset emission, source map rendering, and minification (e.g., **`TerserPlugin`**, **`CssMinimizerPlugin`**).

---

### 4. Detailed Breakdown of Key Hooks

| Tapable Hook                                 | Type              | Owner         | Primary Purpose / Core Plugins                                                    |
| -------------------------------------------- | ----------------- | ------------- | --------------------------------------------------------------------------------- |
| **`compiler.hooks.compile`**                 | `SyncHook`        | `Compiler`    | Prepares compilation parameters before `newCompilation` is spawned.               |
| **`compiler.hooks.thisCompilation`**         | `SyncHook`        | `Compiler`    | Ideal hook for plugins to register event listeners on the `Compilation` object.   |
| **`compilation.hooks.seal`**                 | `SyncHook`        | `Compilation` | Begins the sealing phase; locks the Module Graph from further additions.          |
| **`compilation.hooks.optimizeDependencies`** | `SyncBailHook`    | `Compilation` | Rewrites dynamic imports or removes unused dependency edges.                      |
| **`compilation.hooks.optimizeModules`**      | `SyncBailHook`    | `Compilation` | Triggers tree-shaking and module concatenation (Scope Hoisting).                  |
| **`compilation.hooks.optimizeChunks`**       | `SyncBailHook`    | `Compilation` | Handled by `SplitChunksPlugin` to extract shared module groups into new chunks.   |
| **`compilation.hooks.optimizeModuleIds`**    | `SyncHook`        | `Compilation` | Deterministic module ID assignment.                                               |
| **`compilation.hooks.optimizeChunkIds`**     | `SyncHook`        | `Compilation` | Deterministic chunk ID assignment.                                                |
| **`compilation.hooks.processAssets`**        | `AsyncSeriesHook` | `Compilation` | Multi-stage asset modification (Minification, Banner addition, Compression/Gzip). |
| **`compilation.hooks.afterSeal`**            | `AsyncSeriesHook` | `Compilation` | Concludes the seal phase; returns control back to the `Compiler`.                 |

---

### 5. Writing a Custom Plugin Tapping into `processAssets`

In modern Webpack (v5+), modifying generated assets during the optimize phase is standardized via `compilation.hooks.processAssets`:

```javascript
import { Compiler, Compilation } from 'webpack';

class BuildBannerPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('BuildBannerPlugin', (compilation) => {
      // Tap into the processAssets lifecycle stage
      compilation.hooks.processAssets.tap(
        {
          name: 'BuildBannerPlugin',
          // Stage determines order (e.g., PROCESS_ASSETS_STAGE_ADDITIONS, SUMMARIZE, DERIVED)
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          // Iterate over all emitted bundle assets
          for (const [filename, source] of Object.entries(assets)) {
            if (filename.endsWith('.js')) {
              const banner = `/* Built on ${new Date().toISOString()} */\n`;
              
              // Safely update asset source using Webpack Sources
              compilation.updateAsset(
                filename,
                (oldSource) => new compiler.webpack.sources.ConcatSource(banner, oldSource)
              );
            }
          }
        }
      );
    });
  }
}

```
