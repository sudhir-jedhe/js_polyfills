***  How do error monitoring libraries like Sentry decode production stack traces using source-map VLQ mappings?.md ***

When an error occurs in production, the browser captures a minified stack trace with generated positions (e.g., `bundle.min.js:1:42135`). Error monitoring platforms like **Sentry**, **Datadog**, and **Bugsnag** symbolicate these traces using the **Source Map v3 standard** and **Variable-Length Quantity (VLQ)** decoding.

---

### End-to-End Symbolication Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Ingest Minified Error Event                              │
│    • Stack Frame: `bundle.min.js`, Line: 1, Column: 42135    │
│    • Release / Commit SHA: `v1.4.2`                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Fetch Corresponding Source Map                           │
│    • Query internal artifact storage by Release + File URL  │
│    • Retrieve JSON: `sources`, `names`, `mappings` (VLQ)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Decode VLQ & Binary Search Mapping Index                 │
│    • Decode Base64 VLQ string into 5-tuple numeric fields   │
│    • Search for the closest generated coordinate segment    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Reconstruct Original Frame & Code Context                │
│    • Resolve: `src/components/Checkout.tsx:42:15`           │
│    • Extract function name from `names` dictionary          │
│    • Slice surrounding lines from `sourcesContent`          │
└─────────────────────────────────────────────────────────────┘

```

---

### 1. Anatomy of the Source Map JSON

A standard Source Map v3 contains metadata arrays and the encoded `mappings` string:

```json
{
  "version": 3,
  "file": "bundle.min.js",
  "sources": ["src/utils/math.ts", "src/components/Checkout.tsx"],
  "sourcesContent": ["export const add = ...", "function processPayment() {...}"],
  "names": ["processPayment", "paymentGateway", "charge"],
  "mappings": "AAAA,SAASA;EAATC,UAAU..."
}

```

* **`sources`**: Array of original file paths.
* **`names`**: Array of original symbol/variable/function identifiers prior to minification.
* **`sourcesContent`**: Raw source code strings (enables rich UI code snippets).
* **`mappings`**: Semicolon- and comma-delimited strings encoded in Base64 VLQ.

---

### 2. How the `mappings` String is Structured

The `mappings` string is a multi-level hierarchy:

* **Semicolons (`;`)** represent **Generated Lines** (Line 0, Line 1, Line 2...).
* **Commas (`,`)** separate distinct **Segments** (mapping points) within that generated line.
* **Base64 VLQ Characters** encode 1, 4, or 5 integer fields per segment:

```
Generated Line 1  ──►  AAAA,  SAASA,  EAATC ;  ◄── Generated Line 2
                      └─┬─┘
                        │
      Decodes into 5 Integers (Relative Deltas):
      [GenCol, SourceFileIdx, OrigLine, OrigCol, NameIdx]

```

#### The 5 Fields in Every Mapping Segment

1. **Generated Column Delta**: Column position in the minified output file.
2. **Source Index Delta**: Index into the `sources` array.
3. **Original Line Delta**: 0-based line number in the original source file.
4. **Original Column Delta**: 0-based column number in the original source file.
5. **Name Index Delta (Optional)**: Index into the `names` array for the original identifier.

---

### 3. How Base64 VLQ Decoding Works

Because absolute coordinate offsets for a multi-megabyte bundle would produce huge JSON payloads, coordinates are stored as **relative deltas** and packed into variable-length binary quantities encoded as Base64.

#### The Bit-Level Layout (6 bits per character)

```
┌──────┬──────────────────────┬─────────┐
│ B6   │ B5   B4   B3   B2    │ B1      │
├──────┼──────────────────────┼─────────┤
│ Cont │      Data Bits       │ Sign    │ ◄── First Character of a Number
└──────┴──────────────────────┴─────────┘

┌──────┬────────────────────────────────┐
│ B6   │ B5   B4   B3   B2   B1         │
├──────┼────────────────────────────────┤
│ Cont │           Data Bits            │ ◄── Subsequent Continuation Characters
└──────┴────────────────────────────────┘

```

1. **Continuation Bit (Bit 6 / `0x20`):**

* If `1`, the integer continues into the next Base64 character.
* If `0`, this is the final character for the current integer.

1. **Sign Bit (Bit 1 / `0x01` on first character only):**

* If `1`, the value is negative.
* If `0`, the value is positive.

1. **Delta Accumulation:**
Deltas are stateful and added cumulatively across segments within the file.

---

### 4. Fast Lookup: Binary Searching the Decoded Table

Parsing the entire VLQ string on every incoming error would be too slow at scale. Modern symbolication engines (e.g., Sentry's Rust-based **`symbolic`** library) convert the source map into an optimized flat memory-mapped index:

```
Generated Coordinate Lookup Table:
┌─────────────────────┬──────────────┬───────────────┬────────────────┐
│ Generated Line:Col  │ Source Index │ Original Line │ Original Col   │
├─────────────────────┼──────────────┼───────────────┼────────────────┤
│ Line 1, Col 0       │ 0 (math.ts)  │ Line 1        │ Col 0          │
│ Line 1, Col 12040   │ 1 (Checkout) │ Line 42       │ Col 8          │
│ Line 1, Col 42135   │ 1 (Checkout) │ Line 55       │ Col 14  ◄──────┼─ Matches error!
│ Line 1, Col 60200   │ 1 (Checkout) │ Line 98       │ Col 2          │
└─────────────────────┴──────────────┴───────────────┴────────────────┘

```

When an error comes in at `Line 1, Column 42135`:

1. The engine jumps directly to the array slice for **Generated Line 1**.
2. It executes a **Binary Search (`bsearch`)** for the largest generated column that is `≤ 42135`.
3. It resolves the exact match: **Source Index 1** (`Checkout.tsx`), **Line 55**, **Column 14**.

---

### 5. Symbolication Result

```text
// Before Symbolication (Raw Production Payload):
TypeError: Cannot read properties of undefined (reading 'charge')
    at e.t (https://cdn.example.com/assets/app.min.js:1:42135)

// After VLQ Decoding & Symbolication:
TypeError: Cannot read properties of undefined (reading 'charge')
    at processPayment (src/components/Checkout.tsx:55:14)

    53 | export function processPayment(user: User, amount: number) {
    54 |   const gateway = getGateway();
  > 55 |   return gateway.charge({ userId: user.id, amount });
       |                 ^
    56 | }

```
