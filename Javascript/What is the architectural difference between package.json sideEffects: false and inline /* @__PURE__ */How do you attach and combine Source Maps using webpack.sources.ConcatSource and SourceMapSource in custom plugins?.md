***  How do you attach and combine Source Maps using webpack.sources.ConcatSource and SourceMapSource in custom plugins?.md ***

In Webpack 5, the **`webpack-sources`** package (exposed directly via `compiler.webpack.sources`) provides high-performance data structures for code manipulation without breaking or dropping source map chains.

To combine and attach source maps in a custom plugin, you use **`SourceMapSource`** to wrap code that already has a source map, and **`ConcatSource`** to stitch multiple sources, banners, or footers together while automatically remapping source coordinates.

---

### Core Classes from `webpack.sources`

```
┌─────────────────────────────────────────────────────────────┐
│                    webpack.sources Matrix                   │
├───────────────────┬─────────────────────────────────────────┤
│ ConcatSource      │ Merges multiple Source objects into one │
│                   │ and offsets nested SourceMap mappings.  │
├───────────────────┼─────────────────────────────────────────┤
│ SourceMapSource   │ Represents code along with its input    │
│                   │ raw source map (string or object).      │
├───────────────────┼─────────────────────────────────────────┤
│ RawSource         │ Plain text/buffer with NO source map.   │
│                   │ (Safe for static wrappers/banners).     │
└───────────────────┴─────────────────────────────────────────┘

```

---

### Step-by-Step Implementation

The following custom plugin demonstrates how to:

1. Wrap transformed code and its incoming source map with `SourceMapSource`.
2. Prepend a header/banner and append a footer using `ConcatSource`.
3. Update an existing compilation asset using `compilation.updateAsset()`.

```javascript
// BannerAndWrapPlugin.cjs
class BannerAndWrapPlugin {
  apply(compiler) {
    const pluginName = 'BannerAndWrapPlugin';
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { ConcatSource, SourceMapSource, RawSource } = webpack.sources;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Tap into the asset optimization stage
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          // Use DEVTOOL stage or ADDITIONS depending on map generation order
          stage: Compilation.PROCESS_ASSETS_STAGE_DEVTOOLING,
        },
        (assets) => {
          for (const [filename, asset] of Object.entries(assets)) {
            // Target only generated JavaScript files
            if (!filename.endsWith('.js')) continue;

            // 1. Extract the current code and source map from the compilation asset
            const { source: originalCode, map: originalMap } = asset.sourceAndMap();

            let targetSource;

            if (originalMap) {
              // 2. Wrap existing code and its map into a SourceMapSource
              // Arguments: (code, name, sourceMap, originalSource, innerSourceMap, removeURL)
              targetSource = new SourceMapSource(
                originalCode,
                filename,
                originalMap
              );
            } else {
              // Fallback to RawSource if no source map exists for this asset
              targetSource = new RawSource(originalCode);
            }

            // 3. Create a ConcatSource to stitch parts together
            const finalConcatSource = new ConcatSource();

            // Prepend a banner (RawSource will shift line numbers in originalMap automatically)
            const banner = `/**\n * Bundle: ${filename}\n * Built: ${new Date().toISOString()}\n */\n`;
            finalConcatSource.add(new RawSource(banner));

            // Add the main source code with its mapped lines
            finalConcatSource.add(targetSource);

            // Append an optional footer
            const footer = '\n/* End of module */';
            finalConcatSource.add(new RawSource(footer));

            // 4. Update the asset in the compilation registry
            compilation.updateAsset(filename, finalConcatSource);
          }
        }
      );
    });
  }
}

module.exports = BannerAndWrapPlugin;

```

---

### How `ConcatSource` Handles Line Offsets Under the Hood

When you add a `RawSource` (like a 4-line banner) before a `SourceMapSource`:

```
Line 1: /**                                ◄── RawSource (Unmapped)
Line 2:  * Bundle: main.js                 ◄── RawSource (Unmapped)
Line 3:  */                                ◄── RawSource (Unmapped)
Line 4: console.log("Hello from line 1");  ◄── SourceMapSource: Original Line 1 (Offset by +3)

```

1. **Automatic Line Re-indexing:** `ConcatSource.prototype.map()` walks through each child node in order.
2. **Dynamic Shift:** When emitting the consolidated Source Map, `ConcatSource` calculates how many newlines were introduced by preceding chunks and automatically offsets the line mappings in `SourceMapSource`.

---

### Common Pitfalls & Best Practices

* **Do Not Stringify or Parse Maps Manually:**
Avoid manually editing the `mappings` VLQ string. Pass the raw JSON object or string directly into `new SourceMapSource(code, filename, map)` and let `webpack-sources` handle VLQ decoding and encoding.
* **Pass the Original Source Name:**
The second argument to `SourceMapSource` must match the file name (e.g., `filename` or `this.resourcePath`). This ensures the debugger connects the mapping back to the correct file path.
* **Use `compilation.updateAsset()` instead of direct assignment:**
Always call `compilation.updateAsset(filename, source)` rather than `compilation.assets[filename] = source`. `updateAsset` correctly invalidates internal compilation hash caches and triggers dependent asset hooks.
* **Stage Selection:**
When modifying or combining source maps during `processAssets`, use **`Compilation.PROCESS_ASSETS_STAGE_DEVTOOLING`** or **`PROCESS_ASSETS_STAGE_ADDITIONS`** so devtool plugins can extract or inline the final combined map cleanly.
