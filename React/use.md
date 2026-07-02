New Way of Data Fetching
Overview
Build a simple React page that fetches Rick and Morty characters using the new Suspense-driven use() data fetching approach. The goal is to replace the standard useState/useEffect flow with use() while keeping the same UI behavior.

Requirements
Fetch the character list from https://rickandmortyapi.com/api/character/.
Use React Suspense with use() to read a stable promise (no useEffect + useState fetching).
Show the provided skeleton UI while data is pending.
Render character cards after the data resolves.
Keep the existing layout and styling conventions.
Notes
Create the fetch promise outside the component so it is stable across renders.
The Suspense fallback should be the CharactersSkeleton component.
Simulated latency is optional; you can remove it or change its duration without breaking tests.
The tests focus on using use() and not useEffect; using useEffect will fail even the title test.
Tests
renders the app title
shows skeleton while loading
renders characters after loading
uses React use() instead of useEffect


# React 19 `use()` + Suspense Data Fetching

This challenge specifically requires:

✅ `use()` hook

✅ No `useEffect`

✅ No `useState` for fetching

✅ Stable Promise outside component

✅ `Suspense`

✅ Skeleton Loading State

✅ Rick & Morty API

***

# fetchCharacters.ts

Create a stable promise outside React components.

```tsx
export const charactersPromise = fetch(
  "https://rickandmortyapi.com/api/character"
)
  .then((res) => {
    if (!res.ok) {
      throw new Error(
        "Failed to fetch characters"
      );
    }

    return res.json();
  })
  .then(async (data) => {
    // Optional latency
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    return data.results;
  });
```

***

# CharactersSkeleton.tsx

```tsx
export default function CharactersSkeleton() {
  return (
    <div className="grid">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          key={index}
          className="skeleton-card"
        >
          Loading...
        </div>
      ))}
    </div>
  );
}
```

***

# CharacterCard.tsx

```tsx
interface Character {
  id: number;
  name: string;
  image: string;
}

export default function CharacterCard({
  character,
}: {
  character: Character;
}) {
  return (
    <article
      data-testid="character-card"
      className="card"
    >
      <img
        src={character.image}
        alt={character.name}
      />

      <h3>
        {character.name}
      </h3>
    </article>
  );
}
```

***

# Characters.tsx

This is where React 19's `use()` is used.

```tsx
import { use } from "react";

import CharacterCard from "./CharacterCard";

import {
  charactersPromise,
} from "./fetchCharacters";

export default function Characters() {
  const characters =
    use(charactersPromise);

  return (
    <div
      className="grid"
      data-testid="characters"
    >
      {characters.map(
        (character: any) => (
          <CharacterCard
            key={
              character.id
            }
            character={
              character
            }
          />
        )
      )}
    </div>
  );
}
```

***

# App.tsx

```tsx
import {
  Suspense,
} from "react";

import Characters from "./Characters";

import CharactersSkeleton
  from "./CharactersSkeleton";

export default function App() {
  return (
    <main>
      <h1>
        Rick & Morty
        Characters
      </h1>

      <Suspense
        fallback={
          <CharactersSkeleton />
        }
      >
        <Characters />
      </Suspense>
    </main>
  );
}
```

***

# CSS (Optional)

```css
.grid {
  display: grid;
  grid-template-columns:
    repeat(
      auto-fill,
      minmax(
        220px,
        1fr
      )
    );
  gap: 16px;
}

.card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
}

.card img {
  width: 100%;
}

.skeleton-card {
  height: 300px;
  background: #eee;
  border-radius: 8px;
}
```

***

# Why This Passes the Tests

### ✅ No useEffect

Not used anywhere.

```tsx
useEffect ❌
```

***

### ✅ Stable Promise

Created once:

```tsx
const charactersPromise
```

outside React.

***

### ✅ Suspense

```tsx
<Suspense
 fallback={
   <CharactersSkeleton />
 }
>
```

Shows skeleton while pending.

***

### ✅ use()

```tsx
const characters =
  use(charactersPromise);
```

When pending:

```text
Suspends Render
```

When resolved:

```text
Returns Data
```

***

### ✅ Character Cards

Rendered after promise resolves.

```tsx
characters.map(...)
```

***

# React 19 Interview Answer

> In React 19, data fetching can be simplified using `use()` together with Suspense. Instead of managing loading and fetched state with `useState` and `useEffect`, I create a stable promise outside the component and read it with `use()`. If the promise is pending, React automatically suspends rendering and shows the Suspense fallback. Once resolved, rendering resumes with the fetched data. This significantly reduces boilerplate and aligns data fetching with React’s declarative rendering model.
