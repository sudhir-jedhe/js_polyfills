***  05-custom-hooks-vs-hocs-and-render-props.md ***

# Custom Hooks vs HOCs and Render Props

## Custom hooks vs Higher-Order Components (HOCs)

| Aspect | Custom hooks | HOCs (`withX(Component)`) |
|---|---|---|
| Composition style | Flat — call multiple hooks directly in the component body | Nested wrapping — each HOC adds a layer to the component tree ("wrapper hell") |
| Prop naming collisions | None — hooks return values you name yourself, no prop injection | Possible — two HOCs injecting the same prop name silently conflict |
| Debugging | Values are visible directly in the component's own scope | Extra layers show up in React DevTools tree, harder to trace which HOC provided what |

Prefer custom hooks for new code — they're more composable and don't add extra component layers or obscure prop origins. HOCs are still seen in older codebases and some library integrations (e.g., `connect()` from older Redux patterns) but are largely superseded by hooks for logic reuse. The most common mistake is combining several HOCs on one component and losing track of which one injects which prop. See `12-hoc-render-props` for a full treatment of HOCs and render props.

## Custom hooks vs Render Props

| Aspect | Custom hooks | Render props |
|---|---|---|
| Syntax | Direct function call, destructure the return value | Component takes a function-as-child/prop, JSX nesting required |
| Nesting depth in JSX | None added | Adds a level of JSX nesting per render-prop component used |
| Conditional hook usage | Must follow Rules of Hooks (no conditional calls) | No equivalent restriction — it's just a function call in JSX |

Custom hooks are generally preferred today because they avoid the extra JSX nesting ("callback hell" in markup) that render props introduce, and read more like plain synchronous code. Render props still show up for cases needing render-time flexibility tied to JSX structure itself. The most common mistake is reaching for a render-props library pattern for logic reuse when a plain custom hook would be simpler and flatter.
