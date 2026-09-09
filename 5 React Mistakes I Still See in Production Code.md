# 5 React Mistakes I Still See in Production Code

A production-focused code review guide and refactoring reference addressing architectural pitfalls, performance regressions, and state-synchronization bugs commonly found in enterprise React codebases.

---

### Overview of Common Mistakes & Better Alternatives

| #     | Anti-Pattern / Mistake             | Recommended Pattern | Why It Matters |
| ----- | ---------------------------------- | ------------------- | -------------- |
| **1** | **Using Array Index as `key**`<br> |

<br>`key={index}` | **Stable, Unique ID as `key**`<br>

<br>`key={user.id}` | Prevents component state corruption during reordering, insertions, or deletions; enables predictable DOM reconciliation. |
| **2** | **Monolithic Components**<br>

<br>`Dashboard.jsx` (1000+ lines) | **Single-Responsibility Decomposition**<br>

<br>`<Header/>`, `<Stats/>`, `<Table/>` | Improves testability, reusability, and readability; isolates re-renders to localized component subtrees. |
| **3** | **Manual `useEffect` Data Fetching**<br>

<br>`useEffect(() => { fetchUsers(); }, [])` | **Dedicated Server-State Managers**<br>

<br>TanStack Query / SWR / RTK Query | Eliminates race conditions and unhandled cancellation; supplies automatic caching, deduplication, and background refetching. |
| **4** | **Deep Prop Drilling**<br>

<br>`App` → `Layout` → `Sidebar` → `Profile` | **Context API or Atomic/External Stores**<br>

<br>React Context / Zustand / Redux Toolkit | Removes intermediate passthrough props, decouples nested components, and keeps component APIs lean. |
| **5** | **Duplicated / Redundant State**<br>

<br>`const [fullName, setFullName] = useState(...)` | **Derived Values Computed on Render**<br>

<br>`const fullName = \`${first} ${last}`` | Keeps state minimal and normalized; eliminates out-of-sync bugs and removes unnecessary state cascades. |

### Deep-Dive Analysis & Refactoring Guide

#### 1. Stable Keys vs. Index Keys

**The Problem:** React relies on the `key` prop during the reconciliation algorithm to determine whether an item in an array should be re-rendered, moved, or completely unmounted. When using the array index, adding or removing items shifts the indices of all subsequent elements. Any internal state (input focus, uncontrolled field values, CSS animations) held by child components will stick to the index rather than the logical item, leading to subtle state corruption.

```jsx
// ❌ Anti-pattern: Index breaks state on reorder, filter, or delete
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}

// ✅ Clean pattern: Unique, stable identifier from the data source
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

```

> **Edge-Case Rule:** Array indices are acceptable **only** if the list is strictly static (never reordered, filtered, inserted into, or deleted from) and items carry no local state. If items lack an ID and the list is dynamic, generate unique IDs at data-ingestion time (e.g., using `crypto.randomUUID()`), never inside the render loop.

---

#### 2. Monolithic Components

**The Problem:** Storing business logic, sub-views, modal dialogs, and layout markup in a single multi-hundred-line file causes maintainability bottlenecks and severe performance degradation. Every state change inside the file (e.g., typing in a filter field) forces the entire monster component and its un-memoized descendants to re-render.

```jsx
// ❌ Anti-pattern: 1200+ line monolith handling layout, data, and presentation
export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  // ...100+ lines of helper functions and handlers...

  return (
    <div className="dashboard">
      <header>{/* 80 lines of navigation markup */}</header>
      <section>{/* 150 lines of metric cards */}</section>
      <div className="filters">{/* 120 lines of filter inputs */}</section>
      <table>{/* 400 lines of table logic and rows */}</table>
    </div>
  );
}

// ✅ Clean pattern: Composed, single-responsibility sub-components
export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats />
      <DashboardFilters />
      <DashboardTable />
    </DashboardLayout>
  );
}

```

**Benefits of Decomposition:**

* **Render Isolation:** Filter keystrokes only re-render `<DashboardFilters/>` and `<DashboardTable/>`, leaving `<DashboardHeader/>` and `<DashboardStats/>` untouched.
* **Test Isolation:** Unit-test individual features without mocking the entire dashboard environment.

---

#### 3. Manual Server-State Fetching in `useEffect`

**The Problem:** Handling HTTP requests via bare `useEffect` calls introduces significant risks:

* **Race conditions:** Rapidly changing filters can cause responses to return out of order, overwriting newer queries with stale payloads.
* **Missing cache & deduplication:** Switching tabs or remounting components triggers redundant network requests.
* **Complex boilerplate:** Developers must manually track `isLoading`, `error`, `data`, and unmounted cleanup flags.

```jsx
// ❌ Anti-pattern: Imperative fetching prone to memory leaks & race conditions
useEffect(() => {
  let isMounted = true;
  setLoading(true);

  fetch(`/api/users?query=${query}`)
    .then((res) => res.json())
    .then((data) => {
      if (isMounted) {
        setUsers(data);
        setLoading(false);
      }
    })
    .catch((err) => {
      if (isMounted) setError(err);
    });

  return () => {
    isMounted = false;
  };
}, [query]);

// ✅ Clean pattern: Declarative server-state with TanStack Query
import { useQuery } from '@tanstack/react-query';

const {
  data: users = [],
  isPending,
  error
} = useQuery({
  queryKey: ['users', query],
  queryFn: () => fetchUsers(query),
  staleTime: 1000 * 60 * 5, // Keep cached for 5 minutes
});

```

---

#### 4. Deep Prop Drilling

**The Problem:** Passing values through intermediate components that do not consume them turns intermediate components into brittle pass-through conduits. Changing the prop signature requires editing every file in the chain, directly violating separation of concerns.

```text
❌ Fragile Path:
Page (has theme) ──▶ Layout ──▶ Dashboard ──▶ Sidebar ──▶ ThemeToggle (needs theme)

```

**Solution:** Use **Composition** (slots/children) for shallow nesting, and **React Context** or a lightweight store (like **Zustand**) for truly global/cross-cutting concerns (auth sessions, UI themes, notifications).

```jsx
// ✅ Clean pattern: Atomic Zustand store for global, cross-cutting state
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

// In leaf component (ProfileAvatar.jsx):
export function ProfileAvatar() {
  const currentUser = useUserStore((state) => state.currentUser);
  if (!currentUser) return null;
  return <img src={currentUser.avatarUrl} alt={currentUser.name} />;
}

```

---

#### 5. Storing Redundant or Derived State

**The Problem:** Storing values in state that can be synchronously computed from existing props or state causes synchronization bugs. Developers must write additional `useEffect` hooks to synchronize state `A` with state `B`, leading to cascading re-renders, race conditions, and inconsistent UI states.

```jsx
// ❌ Anti-pattern: Synchronizing derived values across multiple states
const [firstName, setFirstName] = useState('Jane');
const [lastName, setLastName] = useState('Doe');
const [fullName, setFullName] = useState('Jane Doe');

const handleLastNameChange = (e) => {
  setLastName(e.target.value);
  // Easy to forget, or deferred to a useEffect:
  setFullName(`${firstName} ${e.target.value}`);
};

// ✅ Clean pattern: Pure derived value computed dynamically during render
const [firstName, setFirstName] = useState('Jane');
const [lastName, setLastName] = useState('Doe');

// Computed on the fly — zero possibility of de-synchronization
const fullName = `${firstName} ${lastName}`;

```

> **Performance Rule:** If the derived computation is computationally expensive (e.g., filtering an array of 50,000 items), wrap the derivation in `useMemo`, keyed on its raw dependencies:
>
> ```jsx
> const filteredList = useMemo(() => {
>   return largeDataset.filter((item) => item.category === selectedCategory);
> }, [largeDataset, selectedCategory]);
> 
> ```
>
>

---

### Code Review Checklist for Pull Requests

Before approving React pull requests in production repositories, verify:

* [ ] Every `.map()` returning JSX utilizes a stable, domain-level `id` (not the loop index).
* [ ] No single component exceeds ~200–300 lines of code without justified cohesion.
* [ ] No manual data fetching (`fetch`/`axios`) sits inside a `useEffect` without request cancellation, caching, and race-condition guards.
* [ ] Props are not passed through more than two intermediary components without utilizing composition (`children`) or context/store hooks.
* [ ] `useState` is reserved strictly for independent source-of-truth data, with all dependent calculations derived during render.
