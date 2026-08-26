*** copy 01-focus-input-on-mount.md ***

# Snippet: Focusing an input on mount

```jsx
function AutoFocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}
```
