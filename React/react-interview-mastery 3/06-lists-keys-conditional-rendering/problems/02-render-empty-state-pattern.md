*** copy 02-render-empty-state-pattern.md ***

# Problem: `renderEmptyState` pattern for loading/empty/populated list states

## Task

Build a `<UserList>` component that fetches a list of users and cleanly renders three distinct states — loading, empty (loaded but zero results), and populated — using a single reusable `renderEmptyState`-style helper rather than nested ternaries.

## Solution

```jsx
import { useState, useEffect } from 'react';

// A small state machine for async list data: 'loading' | 'empty' | 'populated' | 'error'
function useListStatus(items, isLoading, error) {
  if (isLoading) return 'loading';
  if (error) return 'error';
  if (items.length === 0) return 'empty';
  return 'populated';
}

function Spinner() {
  return <p role="status">Loading users…</p>;
}

function ErrorState({ message, onRetry }) {
  return (
    <div role="alert">
      <p>Couldn't load users: {message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

// The reusable "empty state" renderer — takes a config object so any list
// in the app can plug in its own copy/action without re-deriving the JSX.
function renderEmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  function load() {
    setIsLoading(true);
    setError(null);
    fetchUsers(query)
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [query]);

  const status = useListStatus(users, isLoading, error);

  return (
    <div>
      <input
        placeholder="Search users…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {status === 'loading' && <Spinner />}

      {status === 'error' && <ErrorState message={error} onRetry={load} />}

      {status === 'empty' &&
        renderEmptyState({
          title: query ? `No users match "${query}"` : 'No users yet',
          description: query
            ? 'Try a different search term.'
            : 'Users you add will show up here.',
          action: query ? (
            <button onClick={() => setQuery('')}>Clear search</button>
          ) : null,
        })}

      {status === 'populated' && (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Mock fetch for demonstration purposes.
function fetchUsers(query) {
  const all = [
    { id: 'u1', name: 'Priya Shah' },
    { id: 'u2', name: 'Ahmed Khan' },
    { id: 'u3', name: 'Bo Chen' },
  ];
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(all.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))),
      300
    )
  );
}

export default UserList;
```

## Why this works

- `useListStatus` collapses three independent booleans (`isLoading`, `error`, `items.length`) into one named state (`'loading' | 'error' | 'empty' | 'populated'`), which is exactly the "early return / discrete states" pattern that scales better than nested ternaries once a component has 3+ distinct visual states.
- `renderEmptyState` is a plain function, not a component, that takes a config object (`title`, `description`, `action`) — this makes the empty state reusable across different lists in an app (each call site supplies its own copy and action) without duplicating the empty-state JSX/markup every time.
- Separating "empty because no data exists yet" from "empty because the search matched nothing" (via the `query` check) is a realistic UX detail interviewers look for — a generic "No results" message for both cases reads as sloppy.
- Because each state renders exclusively (`status === 'loading' &&`, etc.), there's no risk of two states rendering simultaneously, unlike chaining multiple independent `&&` conditions on separate booleans.
