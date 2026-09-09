***  How do you refactor components that copy props into state by using keys and lifting state?.md ***

Copying props into state (e.g., `const [email, setEmail] = useState(props.initialEmail)`) is a common source of synchronization bugs in React. When the parent passes a new prop, the child component ignores it because `useState` only initializes state on the component's initial mount.

Developers often try to patch this with `useEffect`, which introduces cascading renders, visual flicker, and race conditions. Refactoring this anti-pattern comes down to two declarative patterns: **resetting with `key**` or **lifting state up to make the component fully controlled**.

---

### The Anti-Pattern

```jsx
// ❌ Bug-prone: syncing prop to state via useEffect
function EditProfile({ user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    // Synchronizing manually causes an extra render cycle, lag, and flash of stale data
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}

```

---

### Refactoring Strategy 1: Resetting State with `key` (For Uncontrolled / Draft State)

Use this strategy when the child component should maintain its own local, editable draft state, but needs to **completely reset all inputs to initial values when switching to a different entity** (e.g., switching from User A to User B).

**Step 1: Keep the local state simple and remove the `useEffect` entirely.**

```jsx
// ✅ Child Component: Pure local state with zero sync logic
function EditProfile({ user }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}

```

**Step 2: Provide a changing `key` prop at the call site in the parent.**

```jsx
// ✅ Parent Component: Enforces a fresh instance per user
function ProfilePage({ currentUser }) {
  return (
    <div>
      {/* Passing `key={currentUser.id}` tells React that when the ID changes, 
          it is a DIFFERENT component instance. React remounts it with clean initial state. */}
      <EditProfile key={currentUser.id} user={currentUser} />
    </div>
  );
}

```

* **Why this works:** When `currentUser.id` changes, React destroys the previous `EditProfile` Fiber tree and constructs a fresh one. `useState(user.name)` and `useState(user.email)` run cleanly on mount without any `useEffect` sync loops.

---

### Refactoring Strategy 2: Lifting State Up (For Fully Controlled Components)

Use this strategy when the parent or sibling components need immediate access to the modified state as the user types, or when the parent must remain the single source of truth.

**Step 1: Remove `useState` from the child and accept values + change handlers.**

```jsx
// ✅ Child Component: Fully controlled presenter
interface EditProfileProps {
  user: { name: string; email: string };
  onChange: (field: string, value: string) => void;
}

function EditProfile({ user, onChange }: EditProfileProps) {
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <input
        value={user.email}
        onChange={(e) => onChange('email', e.target.value)}
      />
    </form>
  );
}

```

**Step 2: Manage the draft state in the parent.**

```jsx
// ✅ Parent Component: Holds and distributes the single source of truth
function ProfilePage({ initialUser }) {
  const [draftUser, setDraftUser] = useState(initialUser);

  const handleFieldChange = (field: string, value: string) => {
    setDraftUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <EditProfile user={draftUser} onChange={handleFieldChange} />
      <PreviewCard user={draftUser} /> {/* Siblings update in real time */}
    </div>
  );
}

```

* **Why this works:** There is no duplicate state to keep in sync. The child cannot be out of sync with its props because it doesn't store a local copy.

---

### Decision Matrix

| Requirement                                                                                        | Preferred Refactor                                        |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Component manages an internal form/draft that should reset when switching items.                   | **Reset with `key={item.id}**`                            |
| Parent or sibling needs immediate access to input values (e.g., live previews, validation badges). | **Lift State Up** (Fully Controlled)                      |
| Child only needs to show read-only computed data derived from props.                               | **Derive during render** (No state at all)                |
| Child must selectively reset *one* input while preserving others on prop change.                   | **Store previous prop in state and adjust during render** |
