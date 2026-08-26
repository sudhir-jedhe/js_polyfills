*** copy 02-dependency-array-semantics.md ***

# The Dependency Array Controls When It Re-Runs

Three forms, and they mean very different things:

```jsx
useEffect(() => { /* ... */ });            // no array: runs after EVERY render
useEffect(() => { /* ... */ }, []);         // empty array: runs once, after initial mount only
useEffect(() => { /* ... */ }, [id]);       // runs after mount, and again whenever `id` changes
```

The dependency array isn't an optimization hint you can freely omit values from — it's how React knows *when the effect's captured values might be stale* and needs to re-run to pick up new ones. Every reactive value the effect body reads (props, state, functions/objects defined in the component) generally belongs in the array; lying about the dependencies is the single most common source of `useEffect` bugs.

## No array vs. empty array vs. array with values

| Aspect | `useEffect(fn)` | `useEffect(fn, [])` | `useEffect(fn, [a, b])` |
|---|---|---|---|
| Runs | After every render | Once, after initial mount only | After mount, then again whenever `a` or `b` changes |
| Typical use case | Rare — usually a sign of a missing dep array | One-time setup with no reactive dependencies | Synchronizing with specific reactive values |
| Risk | Easy to cause performance issues / loops if it also sets state | Stale closures if it references props/state not in the (empty) deps | Correct, as long as the array is exhaustive |

Reach for the array-with-values form as the default; use `[]` only when the effect genuinely reads no reactive values (or only refs, which don't need to be listed). The common mistake is using `[]` to "run once" while still referencing props/state inside, silently freezing those values via a stale closure (see `04-stale-closures-in-effects.md`).
