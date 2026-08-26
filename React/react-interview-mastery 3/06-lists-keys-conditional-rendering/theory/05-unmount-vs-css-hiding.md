*** copy 05-unmount-vs-css-hiding.md ***

# Unmount-based conditional rendering vs CSS-based hiding

| Aspect | `{show && <Component/>}` | `<div style={{display: show ? 'block' : 'none'}}><Component/></div>` |
|---|---|---|
| Component state | Reset every time it's hidden then shown again | Preserved — component stays mounted |
| Effects (`useEffect`) | Cleanup runs on hide, setup reruns on show | Do not re-run just from visibility toggling |
| Cost | Cheaper DOM (fewer nodes when hidden) | Keeps DOM nodes around, higher memory/DOM cost |

Use unmounting when you want a clean slate each time (forms that should reset, modals). Use CSS-based hiding when you need to preserve state or avoid expensive remounts (e.g., tab panels with scroll position or unsaved input). The most common mistake is unmounting a component (like a `Timer` or form) and being surprised its internal state didn't persist across a toggle — `&&`/ternary conditional rendering fully unmounts a component when the condition becomes false, discarding all of its `useState`/`useRef` state and running any `useEffect` cleanup; re-rendering it later is a completely fresh mount.
