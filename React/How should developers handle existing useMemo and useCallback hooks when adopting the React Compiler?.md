When adopting the React Compiler, developers should follow a simple guiding principle: **Leave existing `useMemo`, `useCallback`, and `React.memo` calls in place initially, and stop writing new ones.**

The compiler is designed to be fully backward-compatible. It understands manual memoization hooks, treats them safely, and layers automatic optimization over your existing codebase.

---

### 1. How the Compiler Treats Existing Memoization Hooks

When the compiler encounters `useMemo` or `useCallback`:

* **It preserves developer intent:** The compiler analyzes the dependency array and body of the hook. If the hook is valid according to the Rules of React, the compiler optimizes both the inner computation and the surrounding component.
* **It eliminates subtle dependency bugs:** If a manual dependency array is missing a variable or contains a stale closure, the compiler’s static analysis detects the full set of referenced reactive values and ensures safe caching.
* **No breaking changes or crashes:** Existing hooks do not conflict with the compiler's internal memoization cache (`useMemoCache`).

---

### 2. The Recommended Migration Strategy

#### Phase 1: Don't Do a Mass Deletion

Avoid global find-and-replace scripts to strip `useMemo` and `useCallback`.

* Removing them manually across thousands of files introduces unnecessary churn and risk.
* Some manual `useMemo` calls might be masking underlying impure code or intended identity guarantees that you shouldn't touch without tests.

#### Phase 2: Write Clean, Idiomatic Code Going Forward

For all new components and features:

* Stop importing and wrapping functions in `useCallback`.
* Stop wrapping object literals, transformed arrays, and JSX in `useMemo`.
* Stop wrapping components in `React.memo()`.
* Write standard JavaScript and let the compiler handle reference stability and component re-render skipping.

#### Phase 3: Opportunistic Cleanup During Refactoring

When you revisit an existing file to fix a bug or add a feature:

1. Remove `useMemo`, `useCallback`, and `React.memo`.
2. Verify that the component follows the **Rules of React** (no mutations of props/external state).
3. Test that component behavior and tests remain green.

---

### 3. Edge Cases Where `useMemo` Should Still Be Kept

While the compiler automates >95% of memoization, there are rare cases where keeping a manual hook or using specific patterns is still appropriate:

* **Extremely Expensive Synchronous Calculations:** If a calculation takes tens/hundreds of milliseconds to run on the main thread (e.g., complex cryptography, massive array sorting), an explicit `useMemo` or moving the work to a Web Worker remains a good practice.
* **Custom Hook Return Stability for Non-Compiled Consumers:** If you maintain a shared library or open-source package where consumers might *not* be using the React Compiler, you should continue memoizing hook return objects and callbacks to preserve stable identities for downstream consumers.

---

### 4. Code Refactoring Example

#### Before Compiler (Manual Boilerplate)

```tsx
import React, { useState, useMemo, useCallback } from 'react';

export function ProductCatalog({ products, filterTerm, onSelectProduct }) {
  // Manual array filter memoization
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [products, filterTerm]);

  // Manual callback memoization
  const handleSelect = useCallback((id: string) => {
    onSelectProduct(id);
  }, [onSelectProduct]);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}

const ProductItem = React.memo(function ProductItem({ product, onSelect }) {
  return <li onClick={() => onSelect(product.id)}>{product.name}</li>;
});

```

#### After Compiler (Idiomatic JavaScript)

```tsx
// Clean plain JavaScript: The compiler automatically caches `filteredProducts`,
// stabilizes `handleSelect`, and optimizes `ProductItem` rendering.
export function ProductCatalog({ products, filterTerm, onSelectProduct }) {
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelectProduct(id);
  };

  return (
    <ul>
      {filteredProducts.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}

function ProductItem({ product, onSelect }) {
  return <li onClick={() => onSelect(product.id)}>{product.name}</li>;
}

```

---

### Summary Checklist for Teams

| Action                                 | Recommendation                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Existing `useMemo` / `useCallback**` | **Keep as-is** upon initial compiler rollout.                                               |
| **New code**                           | **Do not write** `useMemo`, `useCallback`, or `React.memo`.                                 |
| **Linting**                            | Enable the `eslint-plugin-react-compiler` to catch code that violates React's purity rules. |
| **Prerequisites**                      | Ensure components adhere strictly to the Rules of React (purity, no prop mutation).         |
