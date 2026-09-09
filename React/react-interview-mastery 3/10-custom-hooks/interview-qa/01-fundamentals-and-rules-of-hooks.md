***  01-fundamentals-and-rules-of-hooks.md ***

# Interview Q&A: Fundamentals and the Rules of Hooks

**Q: What makes a function a "custom hook" rather than just a regular JavaScript function?**

Two things: it calls one or more other hooks internally (built-in ones like `useState`/`useEffect`, or other custom hooks), and it's named starting with `use` by convention. The `use` prefix isn't enforced by the JavaScript runtime, but React's ESLint plugin relies on it to know which functions should be checked against the Rules of Hooks — naming it without the `use` prefix means the linter won't catch violations inside it.

---

**Q: What are the Rules of Hooks?**

Only call hooks at the top level of a function component or custom hook — never inside loops, conditionals, or nested functions. And only call hooks from React function components or other custom hooks — never from plain utility functions, class components, or outside the render flow.

---

**Q: Why do the Rules of Hooks exist? What breaks if you violate them?**

React matches hook calls between renders purely by **call order** — internally it walks a linked list of "hook slots" in the exact sequence they're called, matching the first call this render to the first call last render, and so on, with no other identifier involved. If a hook call is conditionally skipped on some renders, every subsequent hook call shifts to the wrong slot, and React ends up returning stale or mismatched state for those hooks — corrupting component state silently, or throwing an explicit "Rendered fewer/more hooks than expected" error.

---

**Q: Why can't you call a hook inside a callback like `onClick` or inside a `.map()` callback?**

Both violate "only call hooks at the top level" — a hook called inside an event handler runs outside of React's render flow entirely (there's no render happening when the click fires), so there's no "hook slot" for React to match it against. A hook called inside `.map()` would be called a variable number of times depending on array length, which breaks the fixed call-order requirement the same way a conditional does.

---

**Q: What is `eslint-plugin-react-hooks` and why is it considered close to mandatory in React codebases?**

It's the official ESLint plugin that enforces the Rules of Hooks (`rules-of-hooks`) and flags incomplete/incorrect dependency arrays in `useEffect`/`useMemo`/`useCallback` (`exhaustive-deps`) at write time, rather than letting these bugs surface later as runtime crashes or subtle stale-state bugs. Because both classes of bugs are easy to introduce accidentally and hard to spot in review just by reading code, most teams treat this plugin as effectively mandatory rather than optional tooling.
