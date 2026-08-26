*** copy 01-synthetic-events-and-handlers.md ***

# Interview Q&A: SyntheticEvent & Handlers in Function Components

**Q: What is a `SyntheticEvent`, and why does React use it instead of exposing the native event directly?**
It's a cross-browser wrapper object React passes to event handlers instead of the raw browser `Event`, normalizing property names and behavior so handler code doesn't need browser-specific special cases. It exposes the same core interface as a native event (`target`, `preventDefault()`, `stopPropagation()`, etc.), plus access to the original via `event.nativeEvent` when needed.

**Q: Do you need to call `event.persist()` to read event properties inside an async callback like `setTimeout`?**
Not in modern React (17+) — synthetic events used to be pooled and their fields nulled out after the handler returned unless `persist()` was called, but that pooling was removed, so event properties remain accessible in async code without any extra step.

**Q: Why don't function components have `this`-binding issues with event handlers the way class components historically did?**
Function components have no `this` context at all — handlers are just regular functions (often defined inline or as local `const`s) that close over the component's props and state via normal JavaScript closures, not via a `this` reference that needs explicit binding. Class components needed `.bind(this)` in the constructor or arrow-function class fields specifically because regular class methods lose their `this` binding when passed as a callback (like `onClick={this.handleClick}`).
