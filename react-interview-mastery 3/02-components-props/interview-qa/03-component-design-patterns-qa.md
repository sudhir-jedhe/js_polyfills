# Interview Q&A — Component Design Patterns

**Q: What does "controlled" vs. "presentational" mean as a component design heuristic, and is it an official React concept?**
It's not an official React API distinction, just a naming convention/heuristic. A presentational (or "dumb") component renders purely based on the props it receives and holds no business logic or external state — highly reusable and easy to test in isolation. A controlling (or "container") component owns state, data fetching, and business logic, and passes values plus callback props down to presentational children. This separation makes UI pieces reusable independent of where their data comes from.

**Q: How do you forward arbitrary HTML attributes (like `onClick`, `disabled`, `aria-*`) through a wrapper component without listing each one explicitly?**
Use the rest/spread pattern: destructure the props your component cares about, and spread the rest onto the underlying element.

```jsx
function PrimaryButton({ children, ...rest }) {
  return <button className="btn-primary" {...rest}>{children}</button>;
}
```
