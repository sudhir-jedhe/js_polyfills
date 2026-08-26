*** copy 06-useimperativehandle-restricted-api.md ***

# Snippet: useImperativeHandle exposing a restricted API instead of the raw DOM node

```jsx
const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }));
  return <video ref={videoRef} src={props.src} />;
});
```
