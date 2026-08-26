*** copy How do import attributes (formerly import assertions) work with both static and dynamic imports in ECMAScript?.md ***

**Import Attributes** (introduced as a Stage 4 ECMAScript standard replacing the earlier "Import Assertions" syntax) allow developers to supply explicit metadata—most notably module type assertions—alongside module specifiers.

Their primary purpose is **security and deterministic interpretation**: preventing a web server from serving executable JavaScript disguised as a JSON or CSS data payload (mitigating MIME-confusion and script injection attacks).

---

### Key Syntax Change: `assert` $\rightarrow$ `with`

The earlier proposal used the `assert` keyword. This was superseded by the **`with`** keyword to support non-assertion metadata in the future.

```javascript
// ❌ Deprecated / Obsolete Syntax (Import Assertions):
import config from './config.json' assert { type: 'json' };

// ✅ Modern ECMAScript Standard (Import Attributes):
import config from './config.json' with { type: 'json' };

```

---

### 1. Static Imports with Import Attributes

In static declarations, the `with { ... }` clause is placed immediately after the module specifier string.

#### Loading JSON Modules

```javascript
// Static JSON import
import packageInfo from './package.json' with { type: 'json' };

console.log(packageInfo.name);
console.log(packageInfo.version);

```

#### Loading CSS StyleSheets (Constructable Stylesheets in Browsers)

```javascript
// CSS module import
import sheet from './styles.css' with { type: 'css' };

// Directly apply to document or Shadow DOM
document.adoptedStyleSheets = [sheet];

```

#### Re-exporting with Attributes

You can also forward attributes when re-exporting modules:

```javascript
export { default as config } from './config.json' with { type: 'json' };

```

---

### 2. Dynamic Imports with Import Attributes

For dynamic `import()`, attributes are supplied as an options object in the **second argument**:

```javascript
// Dynamic import with options object
async function loadConfig(themeName) {
  try {
    const theme = await import(`./themes/${themeName}.json`, {
      with: { type: 'json' },
    });
    
    console.log('Loaded theme:', theme.default);
  } catch (err) {
    console.error('Failed to load JSON module:', err);
  }
}

```

---

### 3. How the Engine Enforces Attributes Under the Hood

When an import attribute like `with { type: 'json' }` is specified, the JavaScript engine and host environment (Browser / Node.js) enforce a strict verification lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│                      Host Fetch Phase                       │
│  Host downloads file and checks HTTP header:                │
│  `Content-Type: application/json`                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MIME Validation Phase                    │
│  • Does server MIME type match `type: 'json'`?              │
│    ├─► NO  ──► Throw TypeError (Fail before execution)      │
│    └─► YES ──► Proceed to parse as JSON                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Module Evaluation Phase                   │
│  • Module parsed via JSON.parse() semantics                 │
│  • Exposes parsed value as the `default` export             │
└─────────────────────────────────────────────────────────────┘

```

1. **Strict MIME Check:** If you declare `with { type: 'json' }`, but the web server returns `Content-Type: text/javascript`, the runtime throws a **`TypeError`** before parsing or executing any code.
2. **Execution Prevention:** Even if a compromised server responds with malicious JavaScript payload in `config.json`, the engine parses the resource strictly with JSON grammar, preventing arbitrary code execution.
3. **Module Map Caching Isolation:** The module cache key includes the attributes. Importing `./data.json` with `{ type: 'json' }` and an invalid attempt without attributes will never collide or cross-contaminate.

---

### Summary Table

| Context              | Syntax Example                                                                  |
| -------------------- | ------------------------------------------------------------------------------- |
| **Static Import**    | `import data from './data.json' with { type: 'json' };`                         |
| **Dynamic Import**   | `await import('./data.json', { with: { type: 'json' } });`                      |
| **Static Re-export** | `export { default } from './data.json' with { type: 'json' };`                  |
| **Failure Behavior** | Throws `TypeError` during linking/evaluation if MIME type or syntax mismatches. |
