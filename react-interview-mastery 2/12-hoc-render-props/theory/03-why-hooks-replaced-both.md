# Why Hooks Largely Replaced Both Patterns

**Composability.** Stacking multiple HOCs creates deep, hard-to-read nesting: `withAuth(withLoading(withTheme(withUser(Component))))`. Each layer adds an extra component to the tree ("wrapper hell") visible in DevTools as `WithAuth > WithLoading > WithTheme > WithUser > Component`, making debugging and prop-flow tracing harder. Hooks let you compose the same logic *inside* one function body:

```jsx
function Component(props) {
  const auth = useAuth();
  const isLoading = useLoadingState();
  const theme = useTheme();
  const user = useUser();
  // no extra tree depth, no wrapper components
}
```

**Naming collisions.** Two HOCs that both want to inject a prop called `data` or `loading` silently clash — whichever is applied last wins, and there's no compile-time warning. Custom hooks avoid this because each hook's return value is destructured explicitly by the consuming component with whatever local names it chooses.

**Render props' indentation problem.** Nesting several render-prop components (`<DataFetcher>{() => <ThemeProvider>{() => <Auth>{() => ...}}}</ThemeProvider>}</DataFetcher>`) produces a "pyramid of doom." Hooks flatten this to sequential `const` declarations.

**Static typing / refactoring friction.** HOCs are notoriously awkward to type correctly in TypeScript (`hoist-non-react-statics`, generic prop merging), while hooks have straightforward return types.

## Give a concrete example of "wrapper hell" and why it's a problem

Stacking HOCs like `withAuth(withTheme(withData(Component)))` produces a component tree of `WithAuth > WithTheme > WithData > Component` in DevTools. It's a problem because it adds indirection when debugging (which layer sets which prop?), adds render overhead for each wrapper, and makes it harder to trace where a given prop actually originates.

## Why do multiple HOCs risk naming collisions, and how do hooks avoid this?

If two HOCs each inject a prop with the same name (e.g., both call it `status` or `data`), whichever is applied closer to the wrapped component (or spreads its prop last) silently wins, with no compile-time warning. Custom hooks avoid this because each hook returns a value that the consuming component explicitly destructures and names itself — there's no implicit merging of props from independent sources.

## How would you type a HOC in TypeScript, at a high level, and why is it more awkward than typing a hook?

You need generics to preserve the wrapped component's prop type while adding/removing the props the HOC injects, e.g. `function withLoading<P>(Wrapped: ComponentType<P>): ComponentType<P & { isLoading: boolean }>`. It's more awkward than a hook because a hook just declares its own input/output types directly, while a HOC has to correctly merge, subtract, and forward generic prop types across two component boundaries.
