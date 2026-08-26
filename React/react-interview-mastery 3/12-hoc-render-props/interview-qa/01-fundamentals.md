# Interview Q&A: Fundamentals

**Q: What is a higher-order component, in one sentence?**
A function that takes a component as an argument and returns a new component that wraps it with additional props, behavior, or rendering logic — `withX(Component) => EnhancedComponent`.

---

**Q: What is the render props pattern?**
A pattern where a component accepts a function as a prop (commonly `children` or `render`) and calls that function — usually with some internal state — to determine what to render, letting the consumer control the UI while the provider controls the logic.

---

**Q: Give a concrete example of "wrapper hell" and why it's a problem.**
Stacking HOCs like `withAuth(withTheme(withData(Component)))` produces a component tree of `WithAuth > WithTheme > WithData > Component` in DevTools. It's a problem because it adds indirection when debugging (which layer sets which prop?), adds render overhead for each wrapper, and makes it harder to trace where a given prop actually originates.

---

**Q: Why do multiple HOCs risk naming collisions, and how do hooks avoid this?**
If two HOCs each inject a prop with the same name (e.g., both call it `status` or `data`), whichever is applied closer to the wrapped component (or spreads its prop last) silently wins, with no compile-time warning. Custom hooks avoid this because each hook returns a value that the consuming component explicitly destructures and names itself — there's no implicit merging of props from independent sources.
