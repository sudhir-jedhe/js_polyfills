To extract non-JS assets (such as CSS, SVG sprites, or custom metadata) into dedicated standalone output files using a modern **Webpack 5+** architecture, you build a paired **Loader** and **Plugin**.

The loader captures asset contents during the **`make` phase**, while the plugin collects and emits the aggregated file using **`compilation.hooks.processAssets`** during the **`seal` phase**.

---

### Architectural Flow

```
1. MAKE PHASE (Loader)
   [ Source File (.custom / .css) ]
                 │
                 ▼
   • Loader captures file content & metadata
   • Attaches extracted payload to `module.buildInfo`
   • Returns minimal JS (`export default ""`) so JS bundling succeeds
                 │
                 ▼
2. SEAL PHASE (Plugin)
   • `compilation.hooks.processAssets` iterates all modules
   • Collects extracted data from `module.buildInfo`
   • Calls `compilation.emitAsset()` with `RawSource` to output the file

```

---

### Step 1: The Custom Loader (`extract-loader.cjs`)

The loader extracts the raw file content, attaches it to the current module's `buildInfo` container, and exports a valid JavaScript dummy export so Webpack’s parser continues without errors.

```javascript
// extract-loader.cjs
module.exports = function (source) {
  // Access the current module's buildInfo container
  const module = this._module;

  if (module) {
    // Initialize or attach custom metadata
    module.buildInfo.extractedAsset = {
      resourcePath: this.resourcePath,
      content: source,
      timestamp: Date.now(),
    };
  }

  // Return a harmless JS export so the JS graph can resolve imports
  return `export default "";`;
};

```

---

### Step 2: The Custom Plugin (`ExtractAssetPlugin.cjs`)

The plugin accesses `compilation.hooks.processAssets`, scans all compiled modules for `buildInfo.extractedAsset`, combines the contents, and writes the output file.

```javascript
// ExtractAssetPlugin.cjs
const path = require('path');

class ExtractAssetPlugin {
  static loader = path.resolve(__dirname, 'extract-loader.cjs');

  constructor(options = {}) {
    this.outputFilename = options.filename || 'extracted-bundle.txt';
  }

  apply(compiler) {
    const pluginName = 'ExtractAssetPlugin';
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Tap into the asset processing lifecycle stage
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL, // Add new standalone assets
        },
        () => {
          const collectedContents = [];

          // Walk all compiled modules in the graph
          for (const module of compilation.modules) {
            const extracted = module.buildInfo?.extractedAsset;
            if (extracted) {
              const header = `/* Source: ${path.basename(extracted.resourcePath)} */\n`;
              collectedContents.push(header + extracted.content);
            }
          }

          if (collectedContents.length === 0) return;

          // Combine extracted pieces into a single file
          const finalOutput = collectedContents.join('\n\n');

          // Emit the standalone asset into the output directory
          compilation.emitAsset(
            this.outputFilename,
            new RawSource(finalOutput)
          );
        }
      );
    });
  }
}

module.exports = ExtractAssetPlugin;

```

---

### Step 3: Integrating in `webpack.config.js`

```javascript
// webpack.config.js
const path = require('path');
const ExtractAssetPlugin = require('./ExtractAssetPlugin.cjs');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.custom-style$/i,
        use: [
          // Use the loader exported directly by the plugin
          ExtractAssetPlugin.loader,
        ],
      },
    ],
  },
  plugins: [
    new ExtractAssetPlugin({
      filename: 'styles/extracted-styles.css',
    }),
  ],
};

```

---

### Step 4: Verification

If you import custom assets inside your JavaScript entry:

```javascript
// src/index.js
import './theme.custom-style';
import './button.custom-style';

console.log('App started');

```

Running `npx webpack` will generate:

```text
dist/
├── bundle.js                     <-- JS bundle without inlined styles
└── styles/extracted-styles.css   <-- Standalone extracted non-JS asset

```

---

### Production Considerations

1. **Chunk-Aware Splitting:** If you need separate files per entry point or async chunk (rather than a single global file), iterate over `compilation.chunks` instead of `compilation.modules` and inspect `chunkGraph.getChunkModules(chunk)`.
2. **Deterministic Source Maps:** When transforming CSS or source text, use `webpack.sources.SourceMapSource` or `ConcatSource` instead of `RawSource` to forward map mappings.
3. **Persistent Cache Invalidation:** `module.buildInfo` is automatically serialized into Webpack 5's filesystem cache, ensuring rebuilds and watch modes retain extracted assets correctly.
