*** copy 07-missing-return-in-map.md ***

# Output-Based: `.map()` with a block-body arrow and no `return`

```jsx
function Items({ list }) {
  return (
    <ul>
      {list.map((item) => {
        <li key={item.id}>{item.name}</li>;
      })}
    </ul>
  );
}
```

What renders inside the `<ul>`?

**Answer:** Nothing — an empty `<ul>`.

**Why:** The arrow function body uses curly braces `{ ... }`, which makes it a block body requiring an explicit `return`. There is no `return` here, so every call returns `undefined`, and `.map()` produces an array of `undefined`s. React renders `undefined` as nothing. This is a very common copy-paste bug when converting an implicit-return arrow (`item => <li>...`) into a multi-line one.
