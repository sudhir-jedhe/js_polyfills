***  01-sortable-filterable-list-index-key-bug.md ***

# Problem: Sortable/filterable list where index-as-key visibly breaks state — demonstrate then fix

## Task

Build a contact list with a search filter and a "sort by name" button. Each row has a "favorite" checkbox with local component state. Demonstrate that keying by index makes the checked state stick to the wrong contact after filtering/sorting, then fix it with stable IDs.

## Step 1 — the buggy version (index as key)

```jsx
import { useState } from 'react';

const CONTACTS = [
  { id: 'c1', name: 'Priya Shah' },
  { id: 'c2', name: 'Ahmed Khan' },
  { id: 'c3', name: 'Bo Chen' },
];

function ContactRowBuggy({ name }) {
  // Local state lives on the component instance at whatever index it renders at.
  const [favorite, setFavorite] = useState(false);
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />
        {name}
      </label>
    </li>
  );
}

function ContactListBuggy() {
  const [query, setQuery] = useState('');

  const visible = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Filter contacts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {/* BUG: index key — filtering changes which item sits at a given index */}
        {visible.map((c, index) => (
          <ContactRowBuggy key={index} name={c.name} />
        ))}
      </ul>
    </div>
  );
}
```

**Reproduce the bug:** check the box next to "Bo Chen" (index 2). Type "a" into the filter — the list shrinks to `["Priya Shah", "Ahmed Khan"]` (both contain "a"), and "Bo Chen" disappears from the DOM at index 2. React reuses the component instance that was at index 1 ("Ahmed Khan," now the last visible row) for whatever ends up there — the previously-checked state doesn't reliably follow "Bo Chen" at all; instead it stays attached to whichever position happens to end up occupying index 2 next, corrupting the visible checked state for a contact that was never checked.

## Step 2 — the fix (stable ID as key)

```jsx
import { useState } from 'react';

function ContactRowFixed({ id, name, favorite, onToggleFavorite }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={favorite}
          onChange={() => onToggleFavorite(id)}
        />
        {name}
      </label>
    </li>
  );
}

function ContactListFixed() {
  const [query, setQuery] = useState('');
  // Lift "favorite" out of the row entirely, into a Set keyed by stable id —
  // this both fixes the key bug AND removes the class of bug going forward.
  const [favorites, setFavorites] = useState(new Set());

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visible = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Filter contacts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {visible.map((c) => (
          <ContactRowFixed
            key={c.id}
            id={c.id}
            name={c.name}
            favorite={favorites.has(c.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </ul>
    </div>
  );
}

export default ContactListFixed;
```

## Why this works

- The buggy version keys rows by their position in the *filtered* array, but the filtered array's membership and order change on every keystroke — so "index 2" refers to a different contact from one render to the next, and React reuses that DOM node/component instance (and its `useState` favorite flag) for whichever contact now lands there.
- The fixed version keys by `c.id`, which is stable regardless of filtering or sorting — React now correctly tracks "this row is Bo Chen" across any reordering.
- Going further, lifting `favorite` out of the row component into a parent-level `Set<id>` removes the bug class entirely: there's no per-instance state to mismatch in the first place, since "is this id favorited" is looked up by id on every render, not carried inside an ephemeral component instance.
- This same list would break identically under a "sort by name" button for the same reason — sorting reorders the array, and index keys reassign state to the wrong row whenever order changes, not just when items are removed.
