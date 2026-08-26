*** copy 02-default-value-without-provider.md ***

# Snippet: Default value is used only when there's no Provider above

```jsx
const LocaleContext = createContext('en-US');

function LanguageLabel() {
  const locale = useContext(LocaleContext); // 'en-US' if rendered outside a Provider
  return <span>{locale}</span>;
}
```
