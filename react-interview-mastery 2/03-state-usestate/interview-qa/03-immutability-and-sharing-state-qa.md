# Interview Q&A — Immutability and Sharing State

**Q: Why must state updates for arrays/objects always create a new reference instead of mutating in place?**
React's default change detection compares the new state to the old state by reference (`Object.is`), not by deep value comparison. Mutating an array/object in place (`.push()`, `.sort()`, direct property assignment) keeps the same reference, so even if you call the setter afterward, React may conclude nothing changed and skip re-rendering. Always derive a new array/object — spread syntax, `.map()`, `.filter()`, object spread — so the reference itself signals the change.

**Q: What is "lifting state up," and when should you do it?**
It's moving state from a component up to its closest common ancestor with any sibling(s) that need to read or react to that same state, then passing the value and update callbacks back down as props. Do it as soon as two or more components need to share or stay synchronized on the same piece of data — keeping state local otherwise, to avoid unnecessary re-renders of unrelated parts of the tree.

**Q: If you call `setCount(5)` when `count` is already `5`, does the component re-render?**
No, by default React bails out of re-rendering if the new state is reference-equal (`Object.is`) to the current state — this applies to primitives naturally (`5 === 5`) and is a built-in optimization to avoid redundant render work. Note this bailout doesn't apply to objects/arrays unless the reference itself is literally unchanged.
