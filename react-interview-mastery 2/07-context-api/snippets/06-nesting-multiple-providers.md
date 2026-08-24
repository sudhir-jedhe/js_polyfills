# Snippet: Nesting multiple providers cleanly

```jsx
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```
