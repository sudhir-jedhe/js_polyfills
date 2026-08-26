# Interview Q&A: Composition and Prop Drilling

**Q: Why is prop drilling considered an anti-pattern, and what are the alternatives?**
It couples every intermediate component to props it doesn't itself use, just to relay them further down, making refactors and renames expensive since you have to touch every layer in between. Alternatives are composition (pass pre-built elements as `children` or named slot props so intermediate components stay generic) and context (for values genuinely needed by many distant, unrelated descendants).
