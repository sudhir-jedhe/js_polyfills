*** copy 03-sharing-state-and-when-to-extract.md ***

# Interview Q&A: Sharing State and When to Extract a Hook

**Q: If two different components call the same custom hook, do they share state?**

No — each call site gets its own, fully independent instance of whatever state the hook manages internally. Custom hooks let you reuse *logic* (the code defining how state behaves), not the state itself. If two components need to observe and mutate the exact same value, you need Context or an external store, not a custom hook alone.

---

**Q: When would you choose to write a custom hook instead of just inlining the logic directly in the component?**

When the same stateful logic (or a variant of it) is needed in more than one component, or when a single component's logic is complex enough that extracting it improves readability and testability, even if there's currently only one consumer. A useful heuristic: if you're copy-pasting a `useState` + `useEffect` combination between components, or a component's body has grown hard to scan because of interleaved unrelated concerns, that's usually a sign a custom hook extraction is overdue.

---

**Q: If a `useLocalStorage('theme', 'light')` hook is called from two sibling components, will updating the value in one automatically update the other within the same tab?**

No. Even though both calls read the same underlying `localStorage` key on mount, each call creates its own independent `useState`, so the two components' in-memory copies aren't linked. A write from one component updates `localStorage` and its own state, but the other component has no built-in mechanism to notice — the browser's `storage` event only fires in *other* tabs/windows, not the same one. True same-tab sync needs Context, a shared external store, or a manual event/pub-sub mechanism layered on top of the hook.
