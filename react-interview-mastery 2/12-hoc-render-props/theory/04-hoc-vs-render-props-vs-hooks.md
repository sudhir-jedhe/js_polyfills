# HOC vs Render Props vs Custom Hooks

## HOC vs Render Props

| Aspect | Higher-Order Component | Render Props |
|---|---|---|
| Shape | Function that takes a component, returns a new component: `withX(Comp)` | Component that takes a function-as-prop (often `children` or `render`) and calls it to get JSX |
| Composition | Nested wrapping: `withA(withB(withC(Comp)))` — creates extra tree depth per layer | Nested function calls in JSX: `<A>{() => <B>{() => <C>...}}</B>}</A>` — also nests, but as markup indentation rather than component tree depth |
| Common mistake | Forgetting to forward `...rest` props or set `displayName`, breaking prop passthrough or DevTools readability | Recreating the render-prop function inline every render, defeating any memoization on the provider component |

Both solve the same problem (share stateful logic across components); prefer neither for new code — reach for a custom hook instead (see `10-custom-hooks`). Recognize both when reading legacy code or library APIs.

## HOC / Render Props vs Custom Hooks

| Aspect | HOC / Render Props | Custom Hooks |
|---|---|---|
| Component tree impact | Adds wrapper component(s) to the tree ("wrapper hell"), visible in DevTools | Zero extra components — logic lives inside the consuming component's function body |
| Prop naming collisions | Real risk when stacking multiple HOCs/render props that inject same-named props/values | None — each hook's return value is destructured with whatever local names the consumer chooses |
| Common mistake | Stacking too many enhancers, making it hard to trace which layer provides which prop | Violating the Rules of Hooks (calling conditionally, in loops) since hook composition relies on consistent call order |

Default to custom hooks for new shared logic. Only reach for a HOC/render-prop when hooks genuinely can't express the requirement (see `theory/05-when-to-still-use-a-hoc.md`).

## What's the practical difference in the DevTools component tree between using a hook and using a HOC for the same shared logic?

A hook adds zero extra entries to the tree — the logic executes inside the existing component's call frame. A HOC adds one extra named component per wrapper (e.g., `WithLoading`) that appears as a real node in the tree, which is directly inspectable but also adds visual/structural noise as more wrappers stack.
