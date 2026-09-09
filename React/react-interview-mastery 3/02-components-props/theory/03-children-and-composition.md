***  03-children-and-composition.md ***

# `props.children` and Composition

Anything nested between a component's opening and closing tags is passed as the special `children` prop. This is what makes components composable containers rather than fixed templates:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Body text</p>
</Card>
```

`children` can be a single element, a string, an array of elements, or even a function (the "render props" pattern, covered elsewhere). This is the backbone of layout components like `Modal`, `Card`, `Layout` — they don't need to know what's inside them.

## `children` vs. explicit named props for composition

| Aspect | `children` | Named prop (e.g. `header`, `footer`) |
|---|---|---|
| Flexibility | Accepts arbitrary nested JSX, most general | Only accepts what you assign to that specific slot |
| Multiple "slots" | Only one `children` per component | Can have several named slots simultaneously |
| Readability at call site | Nesting reads like normal markup | More explicit about which content goes where |

Use `children` for single-slot wrapper/container components (`Card`, `Modal`, `Layout`'s main area); use named props when a component needs multiple distinct content regions at once (e.g. `<Layout header={<Nav />} sidebar={<Filters />}>{content}</Layout>`). The common mistake is trying to cram multiple unrelated pieces of content into a single `children` and then using fragile array indexing or `React.Children` utilities to pick them apart — named props are simpler.
