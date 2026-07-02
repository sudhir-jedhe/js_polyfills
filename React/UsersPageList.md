# Users List with Search, Filter & Pagination (React Machine Coding)

### Requirements Covered

✅ Display users

✅ Search by name/email

✅ Filter by role

✅ Active user filter

✅ Pagination

✅ Previous / Next

✅ Reset page when filter changes

✅ Prevent page overflow

✅ Role badge colours

✅ No users found

✅ Hide pagination when unnecessary

✅ useMemo optimisation

✅ React.memo

✅ Production-ready architecture

***

# Folder Structure

```text
src/
│
├── App.jsx
├── UsersPage.jsx
├── UserCard.jsx
├── Filters.jsx
├── Pagination.jsx
├── users.js
└── styles.css
```

***

# users.js

```jsx
export const users = [
  {
    id: 1,
    name: "Sudhir Jedhe",
    email: "sudhir@test.com",
    role: "Admin",
    active: true,
  },
  {
    id: 2,
    name: "John Luckachan",
    email: "john@test.com",
    role: "Manager",
    active: false,
  },
  {
    id: 3,
    name: "Apoorva Verma",
    email: "apoorva@test.com",
    role: "Admin",
    active: true,
  },
  {
    id: 4,
    name: "Pawan Kumar",
    email: "pawan@test.com",
    role: "User",
    active: true,
  },
  {
    id: 5,
    name: "Mahendra Aanjna",
    email: "mahendra@test.com",
    role: "User",
    active: false,
  },
  {
    id: 6,
    name: "Kapil",
    email: "kapil@test.com",
    role: "User",
    active: true,
  },
  {
    id: 7,
    name: "Mukesh",
    email: "mukesh@test.com",
    role: "Manager",
    active: true,
  },
  {
    id: 8,
    name: "Jayant",
    email: "jayant@test.com",
    role: "Admin",
    active: true,
  },
];
```

***

# UserCard.jsx

```jsx
import React from "react";

const roleColors = {
  Admin: "#dc3545",
  Manager: "#fd7e14",
  User: "#0d6efd",
};

function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>

      <p>{user.email}</p>

      <span
        className="role-badge"
        style={{
          background:
            roleColors[user.role],
        }}
      >
        {user.role}
      </span>

      <p>
        Status:
        {user.active
          ? " Active"
          : " Inactive"}
      </p>
    </div>
  );
}

export default React.memo(
  UserCard
);
```

***

# Filters.jsx

```jsx
function Filters({
  search,
  setSearch,
  role,
  setRole,
  activeOnly,
  setActiveOnly,
}) {
  return (
    <div className="filters">
      <input
        placeholder="Search Name or Email"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value
          )
        }
      >
        <option value="">
          All Roles
        </option>
        <option value="Admin">
          Admin
        </option>
        <option value="Manager">
          Manager
        </option>
        <option value="User">
          User
        </option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={
            activeOnly
          }
          onChange={(e) =>
            setActiveOnly(
              e.target.checked
            )
          }
        />
        Active Only
      </label>
    </div>
  );
}

export default Filters;
```

***

# Pagination.jsx

```jsx
function Pagination({
  page,
  totalPages,
  setPage,
}) {
  return (
    <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() =>
          setPage(
            (p) => p - 1
          )
        }
      >
        Previous
      </button>

      <span>
        Page {page} of{" "}
        {totalPages}
      </span>

      <button
        disabled={
          page === totalPages
        }
        onClick={() =>
          setPage(
            (p) => p + 1
          )
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
```

***

# UsersPage.jsx

```jsx
import {
  useMemo,
  useState,
  useEffect,
} from "react";

import UserCard from "./UserCard";
import Filters from "./Filters";
import Pagination from "./Pagination";

import { users } from "./users";

const PAGE_SIZE = 3;

export default function UsersPage() {
  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [
    activeOnly,
    setActiveOnly,
  ] = useState(false);

  const [page, setPage] =
    useState(1);

  /*
   Reset Page
   whenever filters change
  */
  useEffect(() => {
    setPage(1);
  }, [
    search,
    role,
    activeOnly,
  ]);

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) => {
          const matchesSearch =
            user.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            user.email
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesRole =
            !role ||
            user.role === role;

          const matchesActive =
            !activeOnly ||
            user.active;

          return (
            matchesSearch &&
            matchesRole &&
            matchesActive
          );
        }
      );
    }, [
      search,
      role,
      activeOnly,
    ]);

  const totalPages =
    Math.ceil(
      filteredUsers.length /
        PAGE_SIZE
    );

  const paginatedUsers =
    useMemo(() => {
      const start =
        (page - 1) *
        PAGE_SIZE;

      return filteredUsers.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      filteredUsers,
      page,
    ]);

  return (
    <div>
      <h1>
        Users Directory
      </h1>

      <Filters
        search={search}
        setSearch={setSearch}
        role={role}
        setRole={setRole}
        activeOnly={
          activeOnly
        }
        setActiveOnly={
          setActiveOnly
        }
      />

      {paginatedUsers.length ===
      0 ? (
        <h2>
          No users found
        </h2>
      ) : (
        <div className="users-grid">
          {paginatedUsers.map(
            (user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            )
          )}
        </div>
      )}

      {filteredUsers.length >
        PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={
            totalPages
          }
          setPage={setPage}
        />
      )}
    </div>
  );
}
```

***

# App.jsx

```jsx
import UsersPage from "./UsersPage";
import "./styles.css";

export default function App() {
  return <UsersPage />;
}
```

***

# styles.css

```css
body {
  font-family: Arial;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.users-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(
        250px,
        1fr
      )
    );

  gap: 16px;
}

.user-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

.role-badge {
  padding: 4px 10px;
  color: white;
  border-radius: 20px;
  font-size: 12px;
}

.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

***

# Time Complexity

### Search

```text
O(n)
```

### Filter

```text
O(n)
```

### Pagination

```text
O(pageSize)
```

***

# Senior-Level Enhancements

```text
✅ Server-side Pagination

✅ Sorting

✅ Debounced Search

✅ React Query

✅ Infinite Scroll

✅ URL State Sync

✅ Virtualization

✅ Loading Skeleton

✅ Error Boundary

✅ Accessibility
```

### Interview Answer

> I would derive the filtered list using `useMemo`, reset pagination whenever filters change using `useEffect`, slice only the current page data, prevent page overflow with disabled navigation buttons, and hide pagination controls when the filtered dataset is smaller than a page. For large datasets, I would move filtering, sorting, and pagination to the backend and use React Query for caching and synchronisation.
