*** copy 04-memoized-provider-value.md ***

# Snippet: Memoizing the provider value to avoid a new object every render

```jsx
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = useCallback((item) => setItems((prev) => [...prev, item]), []);
  const value = useMemo(() => ({ items, addItem }), [items, addItem]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```
