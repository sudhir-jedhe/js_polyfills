*** copy 03-when-memoization-is-a-net-negative.md ***

# Problem 3: A Case Where `useMemo` Is NOT Worth It (Cheap Computation)

## The setup

`FullName` derives a trimmed, concatenated display name from `firstName` and `lastName`. This is about as cheap as computation gets — two string reads, a concatenation, a `.trim()`. There's no `React.memo`-wrapped consumer downstream and nothing else depends on referential stability of the result.

## Adding `useMemo` here — a net negative

```jsx
import { useState, useMemo } from 'react';

function FullNameOverMemoized({ firstName, lastName }) {
  // Unnecessary: useMemo has to (1) allocate storage for the cached value
  // and the dependency array, (2) compare firstName/lastName against last
  // render's values on every render, and (3) only then decide to skip or
  // rerun a computation that is itself cheaper than steps 1-2 combined.
  const fullName = useMemo(
    () => `${firstName} ${lastName}`.trim(),
    [firstName, lastName]
  );
  return <p>{fullName}</p>;
}
```

## Why this is worse, not better

1. **The computation itself is trivially cheap.** A template-literal concatenation and a `.trim()` call on short strings takes a fraction of a microsecond — far less time than `useMemo`'s own bookkeeping (storing the previous dependency array, running `Object.is` comparisons on `firstName` and `lastName` every render, storing the cached result in the fiber).
2. **Nothing downstream benefits from referential stability.** `fullName` is a primitive string here, rendered directly as text — it isn't passed to a `React.memo` child, and it isn't used as a dependency in another `useEffect`/`useMemo`/`useCallback` where a stable reference would prevent an unwanted rerun. (Even if it were, strings are compared by value under `Object.is`, so memoizing a string specifically to stabilize its "reference" buys nothing — `"Ada Lovelace" === "Ada Lovelace"` is already `true` regardless of memoization.)
3. **It adds a dependency array to maintain.** Every future edit to this component that introduces a new value `fullName` should incorporate (e.g., a middle name) risks becoming a missing-dependency bug if someone forgets to add it to the array — a maintenance cost for a hook that was never buying anything in the first place.
4. **It hurts readability for no return.** A reviewer or future maintainer has to pause and ask "why is this memoized?" — and the honest answer is "no reason," which is worse than no comment at all.

## The correct version

```jsx
function FullName({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`.trim();
  return <p>{fullName}</p>;
}
```

## The general rule this illustrates

`useMemo` is worth it only when **both** of these are true: the computation is genuinely expensive (large array processing, heavy math — not a string concat or a short `.map`), **and** the result is consumed somewhere that cares about referential stability (a `React.memo` child, another hook's dependency array). When neither holds, `useMemo` is pure overhead — it doesn't just fail to help, it actively costs more (in both runtime comparison cost and code complexity) than the plain computation it's wrapping.
