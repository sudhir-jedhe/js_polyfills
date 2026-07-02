# Sortable Data Table (React) – Complete Interview Solution

### Features Covered

✅ Render User Table

✅ Hide `id` Column

✅ Sort by Any Other Column

✅ Toggle Asc / Desc

✅ Sort Date Column (`joined`)

✅ Sort Boolean Column (`active`)

✅ Show Sort Icon Only on Active Column

✅ Dynamic ARIA Labels

✅ Alternate Row Colours

✅ Accessible

✅ Production Ready

***

## data.js

```jsx
export const users = [
  {
    id: 1,
    name: "Sudhir",
    email: "sudhir@test.com",
    age: 30,
    active: true,
    joined: "2024-01-10",
  },
  {
    id: 2,
    name: "John",
    email: "john@test.com",
    age: 25,
    active: false,
    joined: "2022-06-15",
  },
  {
    id: 3,
    name: "Apoorva",
    email: "apoorva@test.com",
    age: 35,
    active: true,
    joined: "2023-03-01",
  },
  {
    id: 4,
    name: "Pawan",
    email: "pawan@test.com",
    age: 28,
    active: false,
    joined: "2025-01-20",
  },
];
```

***

# SortableTable.jsx

```jsx
import React, {
  useMemo,
  useState,
} from "react";

import {
  BsSortDown,
  BsSortDownAlt,
} from "react-icons/bs";

import { users } from "./data";

export default function SortableTable() {
  const [
    sortColumn,
    setSortColumn,
  ] = useState(null);

  const [
    direction,
    setDirection,
  ] = useState("asc");

  const columns =
    Object.keys(users[0]).filter(
      key => key !== "id"
    );

  const sortedUsers =
    useMemo(() => {
      const copy = [
        ...users,
      ];

      if (!sortColumn) {
        return copy;
      }

      return copy.sort(
        (a, b) => {
          let valueA =
            a[
              sortColumn
            ];

          let valueB =
            b[
              sortColumn
            ];

          // Date Sorting

          if (
            sortColumn ===
            "joined"
          ) {
            valueA =
              new Date(
                valueA
              ).getTime();

            valueB =
              new Date(
                valueB
              ).getTime();
          }

          // Boolean Sorting

          if (
            sortColumn ===
            "active"
          ) {
            valueA =
              Number(
                valueA
              );

            valueB =
              Number(
                valueB
              );
          }

          // String Sorting

          if (
            typeof valueA ===
            "string"
          ) {
            valueA =
              valueA.toLowerCase();

            valueB =
              valueB.toLowerCase();
          }

          if (
            valueA <
            valueB
          ) {
            return direction ===
              "asc"
              ? -1
              : 1;
          }

          if (
            valueA >
            valueB
          ) {
            return direction ===
              "asc"
              ? 1
              : -1;
          }

          return 0;
        }
      );
    }, [
      sortColumn,
      direction,
    ]);

  const handleSort =
    column => {
      if (
        sortColumn ===
        column
      ) {
        setDirection(
          prev =>
            prev ===
            "asc"
              ? "desc"
              : "asc"
        );
      } else {
        setSortColumn(
          column
        );
        setDirection(
          "asc"
        );
      }
    };

  const getAriaLabel =
    column => {
      const nextDirection =
        sortColumn ===
          column &&
        direction ===
          "asc"
          ? "descending"
          : "ascending";

      return `Sort by ${column} in ${nextDirection} order`;
    };

  return (
    <div className="p-4">
      <h1
        className="text-2xl font-bold mb-4"
      >
        Users Table
      </h1>

      <table className="w-full border border-neutral-300">
        <thead>
          <tr>
            {columns.map(
              column => (
                <th
                  key={
                    column
                  }
                  className="border p-2"
                >
                  <button
                    aria-label={getAriaLabel(
                      column
                    )}
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleSort(
                        column
                      )
                    }
                  >
                    {column}

                    {sortColumn ===
                      column &&
                      (direction ===
                      "asc" ? (
                        <BsSortDown data-testid="sort-icon" />
                      ) : (
                        <BsSortDownAlt data-testid="sort-icon" />
                      ))}
                  </button>
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {sortedUsers.map(
            (
              user,
              index
            ) => (
              <tr
                key={
                  user.id
                }
                className={
                  index %
                    2 ===
                  0
                    ? "even:bg-neutral-200 bg-neutral-200"
                    : ""
                }
              >
                {columns.map(
                  column => (
                    <td
                      key={
                        column
                      }
                      className="border p-2"
                    >
                      {String(
                        user[
                          column
                        ]
                      )}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
```

***

# App.jsx

```jsx
import SortableTable
  from "./SortableTable";

export default function App() {
  return (
    <SortableTable />
  );
}
```

***

# CSS Version (If Not Using Tailwind)

```css
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
}

tbody tr:nth-child(even) {
  background: #e5e5e5;
}

button {
  border: none;
  background: none;
  cursor: pointer;
}
```

***

# Sorting Logic

### String

```js
name
email
```

```jsx
value.toLowerCase()
```

***

### Number

```js
age
```

```jsx
25
30
35
```

***

### Boolean

```js
false
true
```

Convert:

```jsx
Number(false) // 0

Number(true) // 1
```

Ascending:

```text
false
true
```

***

### Date

```js
2024-01-10
```

Convert:

```jsx
new Date(date).getTime()
```

***

# Accessibility

### Current Sort State

```jsx
<BsSortDown />
```

or

```jsx
<BsSortDownAlt />
```

Only render on:

```jsx
sortColumn === column
```

***

### Dynamic aria-label

Current:

```text
name ascending
```

Button says:

```text
Sort by name in descending order
```

because clicking will apply descending next.

***

# Time Complexity

### Sort

```text
O(n log n)
```

### Render

```text
O(n × columns)
```

***

# Senior-Level Follow-up

For 100k+ Rows:

```text
✅ Server-side Sorting

✅ React Query

✅ Virtualization (react-window)

✅ Table Library (TanStack Table)

✅ Memoized Row Rendering

✅ Column Configuration
```

### Interview Answer

> I keep the source data immutable, store the active column and direction in state, derive sorted rows with `useMemo`, and render sort indicators only for the active column. Special handling is added for dates and booleans, while accessibility is achieved through dynamic `aria-labels` that describe the next sort action rather than the current state.
