***  04-unmounting-and-state-preservation.md ***

# Interview Q&A: Unmounting and State Preservation

**Q: If a component is conditionally rendered with `{show && <Timer/>}`, does the timer's internal state persist when `show` toggles off and back on?**

No. Conditional rendering with `&&` or a ternary fully unmounts the component when the condition is false, which discards all of its state (`useState`, `useRef`) and runs any `useEffect` cleanup. When it renders again, it's a completely fresh mount with initial state. To preserve state across visibility toggles, either lift the state to a parent that stays mounted, or hide with CSS (`display: none`) instead of unmounting.

## Comparison table

| Aspect | `{show && <Component/>}` | `<div style={{display: show ? 'block' : 'none'}}><Component/></div>` |
|---|---|---|
| Component state | Reset every time it's hidden then shown again | Preserved — component stays mounted |
| Effects (`useEffect`) | Cleanup runs on hide, setup reruns on show | Do not re-run just from visibility toggling |
| Cost | Cheaper DOM (fewer nodes when hidden) | Keeps DOM nodes around, higher memory/DOM cost |

Use unmounting when you want a clean slate each time (forms that should reset, modals). Use CSS-based hiding when you need to preserve state or avoid expensive remounts (e.g., tab panels with scroll position or unsaved input).
