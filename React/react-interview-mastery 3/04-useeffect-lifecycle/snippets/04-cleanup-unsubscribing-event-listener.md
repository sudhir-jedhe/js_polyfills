***  04-cleanup-unsubscribing-event-listener.md ***

# Cleanup Function Unsubscribing an Event Listener

```jsx
function WindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    function handleResize() { setWidth(window.innerWidth); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <p>Width: {width}px</p>;
}
```
