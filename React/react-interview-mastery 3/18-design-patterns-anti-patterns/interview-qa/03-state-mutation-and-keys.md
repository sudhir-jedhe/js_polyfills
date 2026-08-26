# Interview Q&A: State Mutation and List Keys

**Q: Why is mutating state directly (e.g., `array.push()` then `setState(array)`) a bug, not just a style nit?**
React decides whether to re-render by comparing the new state reference to the old one; if you mutate the existing array/object and pass the same reference back to `setState`, React may not detect a change and can skip re-rendering, or produce inconsistent behavior depending on internals you shouldn't rely on. The fix is always to create a new reference — spread into a new array/object — so React's comparison correctly detects the change.

**Q: Why is using an array index as a `key` problematic, specifically?**
React uses `key` to match elements across renders to the correct component instance. When a list is reordered, filtered, or has items inserted/removed, index-based keys cause React to associate the wrong data with an existing DOM node/component instance, since the index no longer corresponds to the same logical item — this shows up as bugs like local state (a typed input value, an open/closed toggle) sticking to the wrong row after a reorder.

**Q: When, if ever, is index-as-key acceptable?**
When the list is static — never reordered, filtered, sorted, or has items inserted/removed in the middle — and the items have no internal state tied to their identity. In that narrow case, index and identity are equivalent, so there's no correctness risk, though reaching for a stable ID is still the safer default habit.
