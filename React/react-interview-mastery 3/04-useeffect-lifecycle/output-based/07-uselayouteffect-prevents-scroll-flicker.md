*** copy 07-uselayouteffect-prevents-scroll-flicker.md ***

# Given `useLayoutEffect`, Does the User Ever See a Flicker?

```jsx
function AutoScrollBox({ messages }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);
  return <div ref={ref} style={{ overflow: 'auto', height: 200 }}>
    {messages.map(m => <p key={m.id}>{m.text}</p>)}
  </div>;
}
```

**Answer:** No visible flicker — the scroll position is corrected before the browser paints the new messages.

**Why:** `useLayoutEffect` runs synchronously after DOM mutations but *before* the browser paints the frame to the screen, blocking paint until it finishes. That makes it the right tool here: adjusting `scrollTop` happens before the user ever sees the unscrolled state. Using regular `useEffect` instead could cause a single visible frame where the box is unscrolled before snapping down, because `useEffect` runs after paint.
