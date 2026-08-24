# Interview Q&A: Cost/Benefit and Decision-Making

**Q: Is memoizing every value and function in a component always a good idea?**

No. Memoization has its own cost — storing the cached value/deps and comparing the dependency array on every render — and for cheap computations or handlers that aren't consumed by a `React.memo` child or another hook's dependency array, that overhead can exceed the cost of just recomputing/recreating the value. It also adds a dependency array that must be kept exhaustive and correct, which is itself a common source of stale-value bugs. Reach for it when profiling shows an actual expensive computation or unnecessary re-render chain, not reflexively.

---

**Q: How would you decide whether to add `useMemo` around a given computation?**

Ask: is this computation expensive enough to matter (profile if unsure), and is the result consumed somewhere that benefits from referential stability (a `React.memo` child, another hook's dependency array)? If both are true, memoize it with a complete, accurate dependency array. If the computation is cheap and nothing downstream cares about reference identity, skip it — the added complexity isn't worth it.
