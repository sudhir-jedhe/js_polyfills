# Interview Q&A: Error Handling

**Q: Does `Suspense` catch errors, like an error boundary does?**
No. `Suspense` only handles the "pending" case (a thrown promise). A failed dynamic import (e.g., a 404 on the chunk) is a thrown error, not a promise, and propagates up uncaught unless you pair `Suspense` with an actual error boundary placed above it in the tree.

**Q: Where should you place an error boundary relative to a Suspense boundary for lazy-loaded components?**
Above (as an ancestor of) the `Suspense` boundary, so it can catch failures from the lazy import itself as well as any render errors inside the suspended subtree. If placed inside the `Suspense` boundary, it can still catch render errors from the resolved component, but conventionally it's placed outside so one boundary cleanly handles both loading and error states for the whole subtree.
