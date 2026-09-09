***  How would you reset a component state in React?.md ***

The idiomatic way to reset a component's state in React depends on whether you want to **completely re-initialize the entire component** or **imperatively clear specific state values** (e.g., in response to a button click).

---

### 1. The Declarative Way: Changing the `key` Prop (Recommended)

When you change a component's `key`, React treats it as a completely new component instance. It tears down the old Fiber node (running cleanup effects) and recreates it with fresh initial state and DOM nodes.

```jsx
export function ProfileManager() {
  const [userId, setUserId] = useState('user-1');

  return (
    <div>
      <button onClick={() => setUserId('user-2')}>Switch User</button>
      
      {/* Changing `key` completely resets all state inside UserProfile */}
      <UserProfile key={userId} userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  // Reset automatically when `key` changes
  const [comment, setComment] = useState('');
  const [draftPost, setDraftPost] = useState('');

  return (
    <div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
    </div>
  );
}

```

* **Best used for:** Resetting state when an entity ID changes (e.g., user profile, active edit item, document ID).
* **Advantage:** Avoids `useEffect` anti-patterns; handles multi-state resets and child component states automatically.

---

### 2. The Imperative Way: Resetting State Directly via Setter

If you want to reset state in response to an action (like a "Clear" or "Reset Form" button) without destroying the component instance:

**With a Single State / Object:**

```jsx
const initialFormState = { username: '', email: '', bio: '' };

function EditForm() {
  const [form, setForm] = useState(initialFormState);

  const handleReset = () => {
    setForm(initialFormState);
  };

  return (
    <form>
      <input 
        value={form.username} 
        onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))} 
      />
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}

```

**With `useReducer`:**

```jsx
const initialState = { count: 0, text: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset All</button>
    </div>
  );
}

```

---

### 3. Resetting a Child from a Parent (Exposing an Imperative Handle)

If a parent needs to trigger a reset inside a child without forcing a key remount:

```jsx
import { forwardRef, useImperativeHandle, useState } from 'react';

export const SearchInput = forwardRef((props, ref) => {
  const [query, setQuery] = useState('');

  useImperativeHandle(ref, () => ({
    reset() {
      setQuery('');
    }
  }));

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
});

// In Parent:
function Parent() {
  const inputRef = useRef(null);

  return (
    <div>
      <SearchInput ref={inputRef} />
      <button onClick={() => inputRef.current?.reset()}>Clear Input</button>
    </div>
  );
}

```

---

### 4. Anti-Pattern to Avoid: Resetting State with `useEffect`

Do **not** use `useEffect` to watch prop changes and reset state:

```jsx
// ❌ BAD: Causes an extra unnecessary render cycle and visual lag
function UserProfile({ userId }) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment(''); // Triggered AFTER paint, causes second render
  }, [userId]);
}

// ✅ GOOD: Pass `key={userId}` at the call site instead

```

---

### Strategy Comparison

| Method                             | When to Use                                                               | Preserves DOM / Focus?   |
| ---------------------------------- | ------------------------------------------------------------------------- | ------------------------ |
| **`key={id}` Prop**                | Switching entities/records where all internal state should start fresh.   | No (re-mounts DOM node). |
| **State Setter / Reducer `RESET**` | User actions ("Clear form", "Cancel", "Reset defaults").                  | Yes.                     |
| **`useImperativeHandle`**          | Parent needs to imperatively command a child to reset its internal state. | Yes.                     |
