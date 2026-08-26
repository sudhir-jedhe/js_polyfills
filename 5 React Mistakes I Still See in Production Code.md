*** copy 5 React Mistakes I Still See in Production Code.md ***

A structured breakdown and code review guide based on the **"5 React Mistakes I Still See in Production Code"** infographic:

---

### Overview of Common Mistakes & Better Alternatives

| #     | Anti-Pattern / Mistake             | Recommended Pattern | Why It Matters |
| ----- | ---------------------------------- | ------------------- | -------------- |
| **1** | **Using Array Index as `key**`<br> |

<br>`key={index}` | **Stable ID as `key**`<br>

<br>`key={user.id}` | Prevents component state mix-ups during sorting, insertions, or deletions; aids DOM reconciliation. |
| **2** | **Monolithic Components**<br>

<br>`Dashboard.jsx` ($1200+$ lines) | **Single-Responsibility Components**<br>

<br>`Header`, `Stats`, `Table`, `Filters` | Makes codebases testable, reusable, and readable; isolates re-renders to smaller subtree nodes. |
| **3** | **Manual `useEffect` API Calls**<br>

<br>`useEffect(() => { fetchUsers(); }, [])` | **Server-State Libraries**<br>

<br>TanStack Query (React Query) / SWR | Eliminates boilerplate; provides built-in caching, background revalidation, and retry logic. |
| **4** | **Deep Prop Drilling**<br>

<br>`App` $\rightarrow$ `Layout` $\rightarrow$ `Sidebar` $\rightarrow$ `Profile` | **Context API or State Store**<br>

<br>React Context / Zustand / Redux | Cleans up component interfaces; avoids passing props through components that don't need them. |
| **5** | **Storing Redundant/Derived State**<br>

<br>`const [fullName, setFullName] = useState(...)` | **Derived Variables on Render**<br>

<br>`const fullName = \`${first} ${last}`` | Keeps state minimal; prevents out-of-sync state bugs and avoids unnecessary re-render triggers. |

---

### Code Patterns & Refactoring Examples

**1. Stable Keys vs. Index Keys**

```jsx
// ❌ Anti-pattern: Index breaks state on reorder or delete
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}

// ✅ Clean pattern: Unique, stable identifier
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

```

**2. Component Decomposition**

```jsx
// ❌ Anti-pattern: One monolithic 1200+ line component
export default function Dashboard() {
  return <div>{/* All headers, metrics, filters, and tables combined */}</div>;
}

// ✅ Clean pattern: Split by feature responsibility
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

**3. Server-State Management**

```jsx
// ❌ Anti-pattern: Manual fetching boilerplate with race conditions
useEffect(() => {
  let isMounted = true;
  fetch('/api/users')
    .then((res) => res.json())
    .then((data) => isMounted && setUsers(data));
  return () => { isMounted = false; };
}, []);

// ✅ Clean pattern: React Query handles caching and state states out of the box
import { useQuery } from '@tanstack/react-query';

const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

```

**4. Derived Values vs. Duplicated State**

```jsx
// ❌ Anti-pattern: Redundant state sync creates bugs
const [firstName, setFirstName] = useState('Jane');
const [lastName, setLastName] = useState('Doe');
const [fullName, setFullName] = useState('Jane Doe'); // Out of sync if names change!

// ✅ Clean pattern: Pure derived value computed during render
const [firstName, setFirstName] = useState('Jane');
const [lastName, setLastName] = useState('Doe');
const fullName = `${firstName} ${lastName}`;

```

---

### Core Takeaway

Writing clean, modular React code makes components easier to **Read**, **Test**, **Debug**, and **Scale** across production teams.

![alt text](mistake.jpeg)
