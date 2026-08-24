# Interview Q&A: Re-Render Fundamentals

**Q: What are the three things that cause a React function component to re-render?**
Its own state changing (`useState`/`useReducer`), its parent re-rendering (regardless of whether props changed), or a context value it consumes changing. Props changing on their own don't cause a re-render — they matter only as a side effect of the parent re-rendering.

---

**Q: Does a prop changing cause a re-render if the parent didn't re-render?**
No — a component can only receive new props as part of its parent re-rendering and passing different values down. There's no mechanism for a prop to change "in isolation" without the parent function re-running.

---

**Q: Is re-rendering the same thing as updating the DOM? Why does the distinction matter?**
No. A re-render is React calling your component function and producing a new element tree; a DOM update (commit) only happens for the specific nodes that actually differ after React diffs the new tree against the old one. The distinction matters because most re-renders are cheap and produce zero DOM changes — chasing re-renders as if they're inherently expensive leads to premature `memo`/`useMemo` overuse.

---

**Q: How would you use the React DevTools Profiler to confirm a re-render is unnecessary?**
Record a session while performing the suspect interaction, then inspect the flamegraph/ranked chart for that commit. Check which components rendered and use the "why did this render" info; if a component shows up but its rendered output (and DOM diff) is identical to before, and its props/state/context genuinely didn't need to change, that's an unnecessary re-render worth fixing — typically via `memo` plus stabilized props, or by splitting state.
