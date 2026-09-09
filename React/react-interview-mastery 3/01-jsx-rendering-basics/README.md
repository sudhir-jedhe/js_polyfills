***  README.md ***

# JSX & Rendering Basics

JSX is the syntax extension that lets you write UI markup inside JavaScript, which Babel/TypeScript compiles down to plain function calls that build up a tree of React elements. This topic covers how that compilation works, how React reconciles those element trees against the real DOM using the Virtual DOM, and the practical rules that fall out of it — single-root elements, expressions vs. statements, list rendering, conditional rendering, and update batching. Understanding this layer is foundational: almost every "why doesn't my UI update" bug traces back to a misunderstanding of how JSX becomes elements and how React decides what to re-render.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: JSX-to-`createElement` compilation, expressions vs. statements, single-root elements and Fragments, the Virtual DOM/reconciliation/keys, list and conditional rendering, and batching.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 7 "predict the output" questions covering the `&&` stray-zero trap, render/effect ordering, index-as-key bugs, and more, each with the answer and reasoning.
- **`scenarios/`** — 5 real-world engineering scenarios (index-as-key focus bugs, stray-zero badges, component-type-swap state loss, large-list jank, hydration mismatches), each with a worked approach.
- **`interview-qa/`** — 11 Q&A pairs grouped into 4 themed files: JSX compilation/elements, rendering rules/syntax, lists/keys/reconciliation, and conditional rendering/batching.
- **`problems/`** — 3 hands-on coding challenges: a minimal `createElement` + `render` implementation (a from-scratch virtual-DOM-to-real-DOM renderer), a `renderList` helper with correct keying and empty-state handling, and a `renderIf` utility that eliminates the stray-`0` rendering trap.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- JSX-to-`React.createElement`/`jsx-runtime` compilation, and the classic vs. automatic JSX runtimes
- Expressions vs. statements inside JSX (`{}`)
- Why JSX needs a single root element (or Fragment), and Fragment vs. `<div>` tradeoffs
- The Virtual DOM and reconciliation, and the type-based heuristic React uses when diffing
- Rendering lists of elements and the `key` prop — index keys vs. stable id keys
- Conditional rendering patterns: `&&`, ternary, early return — and the `&&`-renders-`0` trap
- How React batches DOM updates, including React 18's automatic batching
- Hands-on: implementing a minimal vnode renderer, a keyed list-rendering helper, and a boolean-safe conditional-render utility
