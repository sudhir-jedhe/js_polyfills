*** copy README.md ***

# `useEffect` & Lifecycle

`useEffect` lets a function component synchronize with something outside React's rendering model — a subscription, a DOM API, a network request, a timer. This topic covers the exact timing of when effects run relative to render and commit, how the dependency array controls re-running, cleanup functions and when they fire, the stale closure trap that catches almost everyone at some point, the classic bugs (missing deps, infinite loops from unstable object/array deps), the narrower `useLayoutEffect` variant, and — importantly — the modern mental model of effects as a synchronization tool rather than a direct replacement for class lifecycle methods like `componentDidMount`.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: `useEffect` timing, dependency array semantics, cleanup functions, stale closures, common bugs (missing deps/infinite loops), and `useLayoutEffect`/effects-as-synchronization.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 7 "predict the output" questions covering render/effect ordering, stale-closure intervals, cleanup sequencing, and unstable dependencies, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a lagging notification badge, a chat that reconnects on every keystroke, an infinite-loop filters panel, a flickering tooltip), each with a worked approach.
- **`interview-qa/`** — 11 Q&A pairs grouped into 4 themed files: timing/dependency array, cleanup/stale closures, infinite loops/unstable dependencies, and `useLayoutEffect`/async race conditions.
- **`problems/`** — 3 hands-on coding challenges: a `useInterval` hook with correct cleanup and callback-without-reset semantics, a `useEventListener` hook that safely adds/removes a global listener, and a diagnosed-and-fixed stale-closure bug shown with both the functional-update and ref-based fixes.
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- `useEffect` mechanics: runs after render/commit, never during render
- Dependency array semantics — no array, empty array, array with deps
- Cleanup functions and exactly when they run (before re-run, and on unmount)
- The stale closure problem inside effects, and its two standard fixes (functional updates, refs)
- Common bugs: missing dependencies, infinite loops from recreated object/array deps
- `useEffect` vs. `useLayoutEffect`, and effects vs. event handlers
- Effects as synchronization, not class-lifecycle replacements
- Hands-on: a `useInterval` hook, a `useEventListener` hook, and fixing a real stale-closure bug two ways
