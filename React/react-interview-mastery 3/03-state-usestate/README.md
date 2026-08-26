*** copy README.md ***

# State & `useState`

`useState` is the primitive hook for giving a function component its own local, persistent, re-render-triggering data. This topic digs into the mechanics that trip people up in interviews and in real bugs: why state updates are asynchronous and batched, why you can't read the "new" value immediately after calling the setter, why state must always be treated as immutable (never mutate arrays/objects in place), how functional updates (`setX(prev => ...)`) solve stale-closure problems, lazy initialization for expensive initial values, and the "lifting state up" pattern for sharing state between sibling components. These are the exact mechanics interviewers probe with "what does this log" questions.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: `useState` mechanics, async/batched updates and closures, functional updates, state immutability, lazy initial state, and lifting state up.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 7 "predict the output" questions covering direct vs. functional updates, mutation bugs, lazy initializers, and stale controlled inputs, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (dropped rapid clicks, a stale cart total, re-parsing localStorage every keystroke, out-of-sync siblings), each with a worked approach.
- **`interview-qa/`** — 11 Q&A pairs grouped into 4 themed files: mechanics/initialization, async updates/batching/functional form, immutability/sharing state, and hooks rules/resetting state.
- **`problems/`** — 3 hands-on coding challenges: a simplified `useState` implemented from scratch with module-level closures, a multi-step form wizard managing step + per-step data, and an undo/redo manager for a text input built on a history array.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- `useState` mechanics: initial value, setter, re-renders, and the `Object.is` bailout
- Functional updates (`setX(prev => ...)`) and why they matter
- State updates are asynchronous and batched
- Why you can't rely on reading state right after calling the setter
- State immutability — never mutate arrays/objects directly
- Lazy initial state: `useState(() => expensiveInit())`
- Lifting state up to share state between components, and resetting state via `key`
- Hands-on: reimplementing `useState`'s core mechanism, a multi-step wizard, and an undo/redo text input
