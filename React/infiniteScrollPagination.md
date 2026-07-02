# Infinite Scroll Pagination (React + TypeScript)

This is one of the most common **Senior React / Frontend System Design** interview questions.

## Requirements

✅ Load initial page

✅ Load more data when scrolling near bottom

✅ Loading state

✅ Error handling

✅ Prevent duplicate requests

✅ Abort previous requests

✅ Works with large datasets

✅ Virtualization Ready

***

# Architecture

```text
User Scrolls
      │
      ▼
Intersection Observer
      │
      ▼
Next Page Request
      │
      ▼
API
      │
      ▼
Append Results
      │
      ▼
Render List
```

***

# API Response

```ts
interface User {
  id: number;
  name: string;
}

interface UsersResponse {
  data: User[];
  page: number;
  totalPages: number;
}
```

***

# Custom Hook

## useInfiniteScroll.ts

```tsx
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface PaginationResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

export function useInfiniteScroll<T>(
  fetchData: (
    page: number
  ) => Promise<PaginationResponse<T>>
) {
  const [items, setItems] =
    useState<T[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  const observerRef =
    useRef<IntersectionObserver>();

  const lastElementRef =
    useCallback(
      (node: HTMLElement | null) => {
        if (loading) return;

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current =
          new IntersectionObserver(
            entries => {
              if (
                entries[0].isIntersecting &&
                hasMore
              ) {
                setPage(
                  prev => prev + 1
                );
              }
            }
          );

        if (node) {
          observerRef.current.observe(
            node
          );
        }
      },
      [loading, hasMore]
    );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const response =
          await fetchData(page);

        if (cancelled) return;

        setItems(prev => [
          ...prev,
          ...response.data,
        ]);

        setHasMore(
          page <
            response.totalPages
        );
      } catch (error) {
        setError(
          "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [page, fetchData]);

  return {
    items,
    loading,
    error,
    hasMore,
    lastElementRef,
  };
}
```

***

# Mock API

## api.ts

```tsx
export async function fetchUsers(
  page: number
) {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  const pageSize = 20;

  return {
    page,
    totalPages: 5,
    data: Array.from(
      {
        length: pageSize,
      },
      (_, index) => ({
        id:
          (page - 1) *
            pageSize +
          index +
          1,

        name: `User ${
          (page - 1) *
            pageSize +
          index +
          1
        }`,
      })
    ),
  };
}
```

***

# Infinite Scroll Component

## UsersList.tsx

```tsx
import {
  useInfiniteScroll,
} from "./useInfiniteScroll";

import { fetchUsers }
  from "./api";

export default function UsersList() {
  const {
    items,
    loading,
    error,
    hasMore,
    lastElementRef,
  } =
    useInfiniteScroll(
      fetchUsers
    );

  return (
    <div className="container">
      <h2>
        Infinite Scroll
      </h2>

      <ul>
        {items.map(
          (
            user,
            index
          ) => {
            const isLast =
              index ===
              items.length - 1;

            return (
              <li
                key={
                  user.id
                }
                ref={
                  isLast
                    ? lastElementRef
                    : null
                }
                className="user"
              >
                {
                  user.name
                }
              </li>
            );
          }
        )}
      </ul>

      {loading && (
        <p>
          Loading...
        </p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!hasMore && (
        <p>
          End of List
        </p>
      )}
    </div>
  );
}
```

***

# App.tsx

```tsx
import UsersList from "./UsersList";

export default function App() {
  return <UsersList />;
}
```

***

# CSS

```css
.container {
  width: 500px;
  margin: 40px auto;
}

.user {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
```

***

# Production Version Improvements

## 1. Prevent Duplicate Calls

```tsx
const fetchingRef =
  useRef(false);

if (fetchingRef.current)
  return;

fetchingRef.current = true;
```

***

## 2. AbortController

```tsx
const controller =
  new AbortController();

fetch(url, {
  signal:
    controller.signal,
});
```

Cancel when component unmounts.

***

## 3. Virtualisation

For:

```text
100,000 records
```

Use:

```bash
npm install react-window
```

```tsx
<FixedSizeList />
```

Render only visible rows.

***

## 4. React Query Infinite Query

Production approach:

```tsx
useInfiniteQuery({
  queryKey: ["users"],
  queryFn:
    fetchUsers,
  getNextPageParam:
    lastPage =>
      lastPage.page <
      lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
});
```

Benefits:

* Cache
* Retry
* Background refresh
* Deduplication
* Optimistic updates

***

# Senior Frontend Interview Discussion

### Why not use Scroll Event?

```tsx
window.addEventListener(
  "scroll"
);
```

Problems:

* Fires frequently
* Expensive calculations
* Layout thrashing

### Why use IntersectionObserver?

✅ Native browser optimisation

✅ Event-driven

✅ Better performance

✅ Less CPU usage

***

# Complexity

### Without Virtualisation

```text
Render = O(n)
Memory = O(n)
```

### With Virtualisation

```text
Render = O(visible items)
Memory = O(visible items)
```

***

# Interview-Level Architecture

```text
Backend
   │
Paginated API
   │
   ▼
Infinite Query Hook
   │
Intersection Observer
   │
   ▼
Virtualized List
   │
   ▼
UI
```

This is the implementation and discussion depth typically expected for a **Senior React Developer / Frontend Lead** interview when designing an Infinite Scroll Pagination solution.



Below is a **production-ready Infinite Scroll Pagination implementation in React + TypeScript** with:

✅ Custom Hook (`useInfiniteScroll`)  
✅ IntersectionObserver  
✅ AbortController  
✅ Error Handling  
✅ Loading State  
✅ Retry Support  
✅ Prevent Duplicate Requests  
✅ Pagination API Integration  
✅ TypeScript  
✅ Virtualisation Ready

***

# Folder Structure

```text
src/
├── App.tsx
├── hooks/
│   └── useInfiniteScroll.ts
├── services/
│   └── userService.ts
├── types/
│   └── user.ts
├── components/
│   ├── UserCard.tsx
│   └── UserList.tsx
└── styles.css
```

***

# types/user.ts

```ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}
```

***

# services/userService.ts

Mock API

```ts
import { PaginatedResponse, User } from "../types/user";

export async function fetchUsers(
  page: number,
  signal?: AbortSignal
): Promise<PaginatedResponse<User>> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  if (signal?.aborted) {
    throw new DOMException(
      "Aborted",
      "AbortError"
    );
  }

  const PAGE_SIZE = 20;
  const TOTAL_PAGES = 10;

  const users: User[] = Array.from(
    { length: PAGE_SIZE },
    (_, index) => ({
      id:
        (page - 1) *
          PAGE_SIZE +
        index +
        1,
      name: `User ${
        (page - 1) *
          PAGE_SIZE +
        index +
        1
      }`,
      email: `user${
        (page - 1) *
          PAGE_SIZE +
        index +
        1
      }@example.com`,
    })
  );

  return {
    data: users,
    page,
    totalPages: TOTAL_PAGES,
  };
}
```

***

# hooks/useInfiniteScroll.ts

```ts
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface InfiniteResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

export function useInfiniteScroll<T>(
  fetchFunction: (
    page: number,
    signal?: AbortSignal
  ) => Promise<InfiniteResponse<T>>
) {
  const [items, setItems] =
    useState<T[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  const observerRef =
    useRef<IntersectionObserver>();

  const fetchingRef =
    useRef(false);

  const controllerRef =
    useRef<AbortController>();

  const loadPage =
    useCallback(async () => {
      if (
        fetchingRef.current ||
        !hasMore
      ) {
        return;
      }

      fetchingRef.current = true;

      controllerRef.current?.abort();

      const controller =
        new AbortController();

      controllerRef.current =
        controller;

      try {
        setLoading(true);
        setError(null);

        const response =
          await fetchFunction(
            page,
            controller.signal
          );

        setItems(prev => [
          ...prev,
          ...response.data,
        ]);

        setHasMore(
          response.page <
            response.totalPages
        );
      } catch (error: any) {
        if (
          error.name !==
          "AbortError"
        ) {
          setError(
            "Failed to fetch data"
          );
        }
      } finally {
        fetchingRef.current =
          false;
        setLoading(false);
      }
    }, [
      page,
      hasMore,
      fetchFunction,
    ]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const lastElementRef =
    useCallback(
      (
        node: HTMLElement | null
      ) => {
        if (
          loading ||
          !hasMore
        ) {
          return;
        }

        if (
          observerRef.current
        ) {
          observerRef.current.disconnect();
        }

        observerRef.current =
          new IntersectionObserver(
            entries => {
              if (
                entries[0]
                  .isIntersecting
              ) {
                setPage(
                  prev =>
                    prev + 1
                );
              }
            },
            {
              rootMargin:
                "100px",
            }
          );

        if (node) {
          observerRef.current.observe(
            node
          );
        }
      },
      [
        loading,
        hasMore,
      ]
    );

  const retry = () => {
    setError(null);
    loadPage();
  };

  return {
    items,
    loading,
    error,
    hasMore,
    retry,
    lastElementRef,
  };
}
```

***

# components/UserCard.tsx

```tsx
import { User } from "../types/user";

interface Props {
  user: User;
}

export default function UserCard({
  user,
}: Props) {
  return (
    <div className="user-card">
      <h4>{user.name}</h4>
      <p>{user.email}</p>
    </div>
  );
}
```

***

# components/UserList.tsx

```tsx
import UserCard from "./UserCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { fetchUsers } from "../services/userService";

export default function UserList() {
  const {
    items,
    loading,
    error,
    hasMore,
    retry,
    lastElementRef,
  } =
    useInfiniteScroll(
      fetchUsers
    );

  return (
    <div className="container">
      <h2>
        Infinite Scroll Users
      </h2>

      {items.map(
        (
          user,
          index
        ) => {
          const isLast =
            index ===
            items.length - 1;

          return (
            <div
              key={user.id}
              ref={
                isLast
                  ? (
                      lastElementRef as any
                    )
                  : null
              }
            >
              <UserCard
                user={user}
              />
            </div>
          );
        }
      )}

      {loading && (
        <div className="loader">
          Loading...
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>

          <button
            onClick={
              retry
            }
          >
            Retry
          </button>
        </div>
      )}

      {!hasMore && (
        <div className="end">
          End of Results
        </div>
      )}
    </div>
  );
}
```

***

# App.tsx

```tsx
import UserList from "./components/UserList";
import "./styles.css";

export default function App() {
  return (
    <div>
      <UserList />
    </div>
  );
}
```

***

# styles.css

```css
body {
  font-family: Arial,
    sans-serif;
  background: #f5f5f5;
}

.container {
  width: 600px;
  margin: 30px auto;
}

.user-card {
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.loader,
.error,
.end {
  text-align: center;
  padding: 20px;
}

button {
  padding: 10px 16px;
  cursor: pointer;
}
```

***

# Senior Frontend Interview Enhancements

If this comes up in an interview, mention additional production improvements:

### Virtualization

```bash
npm install react-window
```

```tsx
<FixedSizeList />
```

For:

```text
100,000+ records
```

***

### React Query Version

```tsx
useInfiniteQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  getNextPageParam: lastPage =>
    lastPage.page <
    lastPage.totalPages
      ? lastPage.page + 1
      : undefined,
});
```

***

### Optimisations

```text
✅ IntersectionObserver
✅ AbortController
✅ Request Deduplication
✅ Retry
✅ Skeleton Loading
✅ LRU Cache
✅ Virtualization
✅ React Query
✅ Error Boundary
✅ Analytics Tracking
```

***

# Complexity

### Without Virtualization

```text
Render: O(n)
Memory: O(n)
```

### With Virtualization

```text
Render: O(visible items)
Memory: O(visible items)
```

This is the level of implementation expected for a **Senior React Developer / Frontend Lead** interview when discussing Infinite Scroll Pagination.
