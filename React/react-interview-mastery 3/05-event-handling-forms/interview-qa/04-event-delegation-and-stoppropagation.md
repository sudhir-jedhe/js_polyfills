*** copy 04-event-delegation-and-stoppropagation.md ***

# Interview Q&A: Event Delegation & stopPropagation

**Q: Where does React actually attach the native event listeners for things like `onClick`, and why does that matter?**
Rather than attaching a native listener to every individual DOM element with a handler, React attaches one listener per event type at the root container the app is rendered into (as of React 17+; earlier versions used `document`), and internally dispatches to the correct component handler by walking the React element tree. This event delegation is largely invisible to application code, but it means the native DOM event still bubbles through the real DOM tree independent of React's own synthetic dispatch — so `stopPropagation()` on a synthetic event stops other React handlers from firing, but doesn't stop a native listener attached directly to a DOM ancestor via `addEventListener`.

**Q: If you call `event.stopPropagation()` inside a React child's click handler, will a parent's native `document.addEventListener('click', ...)` listener still fire?**
Yes. `stopPropagation()` on a SyntheticEvent only stops propagation within React's own delegated event system (further React `onClick` handlers up the component tree) — it has no effect on native listeners attached directly to real DOM nodes, since the native click event bubbles through the actual DOM independently of React's synthetic dispatch mechanism.

## Comparison table

| Aspect | `stopPropagation()` on a React SyntheticEvent | Native `addEventListener` handler on a real DOM ancestor |
|---|---|---|
| What it stops | Further React-registered handlers up the component tree | Nothing on its own — native bubbling happens independent of React's delegated dispatch |
| Interaction | Calling it in a React handler does NOT stop a native listener attached directly via `addEventListener` from also firing | Unaffected by React's synthetic stopPropagation |

Be aware of this when integrating third-party libraries that attach native listeners (e.g., a "click outside to close" library listening on `document`), since a React child's `stopPropagation()` won't shield your component from them. The common mistake is assuming `stopPropagation()` inside a React handler provides the same guarantee as it would in an all-native-DOM codebase, then being surprised when an unrelated native listener still fires.
