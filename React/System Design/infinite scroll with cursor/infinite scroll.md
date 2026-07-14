# Below is an **interview-ready system design + complete React JS code** for a **custom hook for infinite scroll with cursor-based pagination**.

This pattern is useful for:

- Comments
- Feeds
- Notifications
- Chat history
- Activity logs
- Product listings
- Search results

---

## 1. What Is Cursor-Based Pagination?

Instead of page numbers:

```txt
?page=1&limit=10
?page=2&limit=10
```

Cursor pagination uses a pointer to the next result set:

```txt
?cursor=abc123&limit=10
```

Example API response:

```json
{
  "items": [
    {
      "id": "101",
      "text": "Comment 101"
    }
  ],
  "nextCursor": "comment_101",
  "hasMore": true
}
```

---

## 2. Why Cursor Pagination Is Better Than Page Pagination?

## Offset/Page Pagination

```txt
GET /comments?page=2&limit=10
```

Problem:

If new comments are inserted before page 2, data may shift.

You may see:

```txt
Duplicate records
Missing records
Inconsistent ordering
```

---

## Cursor Pagination

```txt
GET /comments?cursor=lastCommentId&limit=10
```

Better because the server says:

```txt
Continue after this item
```

It is more stable for frequently changing data like comments, feeds, and notifications.

---

## 3. High-Level System Design

```txt
User scrolls down
      ↓
IntersectionObserver detects bottom element
      ↓
Custom hook calls backend API
      ↓
API returns items + nextCursor + hasMore
      ↓
Hook appends new items
      ↓
UI renders updated list
```

---

# 4. API Contract

## Request

```http
GET /api/comments?cursor=null&limit=10
```

## Response

```json
{
  "items": [
    {
      "id": "1",
      "text": "First comment",
      "author": "Sudhir"
    }
  ],
  "nextCursor": "1",
  "hasMore": true
}
```

---

## 5. Project Structure

```txt
src/
 ├── App.jsx
 ├── hooks/
 │    └── useInfiniteCursorScroll.js
 ├── api/
 │    └── commentsApi.js
 ├── components/
 │    └── CommentFeed.jsx
 └── styles.css
```

---

## 6. Complete Code

---

## `src/api/commentsApi.js`

This is a fake API simulation. In production, replace this with Axios/fetch API calls.

```jsx
const MOCK_COMMENTS = Array.from({ length: 50 }, (_, index) => ({
  id: String(index + 1),
  text: `This is comment number ${index + 1}`,
  author: `User ${index + 1}`,
  createdAt: new Date(Date.now() - index * 100000).toISOString(),
}));

export async function fetchCommentsByCursor({
  cursor = null,
  limit = 10,
  signal,
}) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      let startIndex = 0;

      if (cursor) {
        const cursorIndex = MOCK_COMMENTS.findIndex(
          (comment) => comment.id === cursor,
        );

        startIndex = cursorIndex + 1;
      }

      const paginatedItems = MOCK_COMMENTS.slice(
        startIndex,
        startIndex + limit,
      );

      const lastItem = paginatedItems[paginatedItems.length - 1];

      const nextCursor = lastItem ? lastItem.id : null;

      const hasMore = startIndex + limit < MOCK_COMMENTS.length;

      resolve({
        items: paginatedItems,
        nextCursor,
        hasMore,
      });
    }, 700);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Request aborted", "AbortError"));
    });
  });
}
```

---

## `src/hooks/useInfiniteCursorScroll.js`

This is the reusable custom hook.

```jsx
import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteCursorScroll({
  fetchData,
  limit = 10,
  enabled = true,
}) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);

  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const hasFetchedInitialData = useRef(false);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasMore) return;

    try {
      setError(null);

      if (items.length === 0) {
        setIsInitialLoading(true);
      }

      setIsLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetchData({
        cursor,
        limit,
        signal: controller.signal,
      });

      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.id));

        const uniqueNewItems = response.items.filter(
          (item) => !existingIds.has(item.id),
        );

        return [...prevItems, ...uniqueNewItems];
      });

      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [enabled, isLoading, hasMore, fetchData, cursor, limit, items.length]);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];

          if (firstEntry.isIntersecting && hasMore) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: "200px",
          threshold: 0.1,
        },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, loadMore],
  );

  const reset = useCallback(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    hasFetchedInitialData.current = false;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (!hasFetchedInitialData.current) {
      hasFetchedInitialData.current = true;
      loadMore();
    }
  }, [enabled, loadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    loadMore,
    lastElementRef,
    reset,
  };
}
```

---

## `src/components/CommentFeed.jsx`

```jsx
import { useInfiniteCursorScroll } from "../hooks/useInfiniteCursorScroll";
import { fetchCommentsByCursor } from "../api/commentsApi";

export default function CommentFeed() {
  const {
    items: comments,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    lastElementRef,
    loadMore,
    reset,
  } = useInfiniteCursorScroll({
    fetchData: fetchCommentsByCursor,
    limit: 10,
    enabled: true,
  });

  if (isInitialLoading) {
    return <p className="status-text">Loading comments...</p>;
  }

  return (
    <section className="feed-container">
      <div className="feed-header">
        <h1>Infinite Comments Feed</h1>

        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>

      {comments.map((comment, index) => {
        const isLastItem = index === comments.length - 1;

        return (
          <article
            key={comment.id}
            ref={isLastItem ? lastElementRef : null}
            className="comment-card"
          >
            <div className="comment-header">
              <strong>{comment.author}</strong>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>

            <p>{comment.text}</p>
          </article>
        );
      })}

      {isLoading && <p className="status-text">Loading more comments...</p>}

      {error && (
        <div className="error-box">
          <p>{error}</p>

          <button type="button" onClick={loadMore}>
            Retry
          </button>
        </div>
      )}

      {!hasMore && comments.length > 0 && (
        <p className="status-text">You have reached the end.</p>
      )}
    </section>
  );
}
```

---

## `src/App.jsx`

```jsx
import CommentFeed from "./components/CommentFeed";
import "./styles.css";

export default function App() {
  return (
    <main className="app">
      <CommentFeed />
    </main>
  );
}
```

---

## `src/styles.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  color: #111827;
}

.app {
  min-height: 100vh;
  padding: 32px;
}

.feed-container {
  max-width: 760px;
  margin: 0 auto;
}

.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.feed-header h1 {
  margin: 0;
  font-size: 28px;
}

.feed-header button {
  border: none;
  background: #2563eb;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.feed-header button:hover {
  background: #1d4ed8;
}

.comment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
}

.comment-header span {
  color: #6b7280;
  font-size: 12px;
}

.comment-card p {
  line-height: 1.5;
}

.status-text {
  text-align: center;
  color: #6b7280;
  margin: 24px 0;
}

.error-box {
  text-align: center;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 16px;
  border-radius: 8px;
}

.error-box button {
  margin-top: 8px;
  border: none;
  background: #dc2626;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
```

---

# 7. How the Hook Works

The hook exposes:

```jsx
{
  (items,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    loadMore,
    lastElementRef,
    reset);
}
```

The important part is this:

```jsx
ref={isLastItem ? lastElementRef : null}
```

Only the last rendered item receives the observer ref.

When the last item comes near the viewport:

```txt
IntersectionObserver triggers
        ↓
loadMore() runs
        ↓
API fetches next cursor batch
        ↓
New items are appended
```

---

# 8. Cursor-Based Backend Design

In a real backend, your API can look like this:

```http
GET /api/comments?cursor=100&limit=10
```

## Node.js Express Example

```js
app.get("/api/comments", async (req, res) => {
  const { cursor, limit = 10 } = req.query;

  const query = {};

  if (cursor) {
    query._id = {
      $lt: cursor,
    };
  }

  const comments = await Comment.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit) + 1);

  const hasMore = comments.length > limit;

  const items = hasMore ? comments.slice(0, limit) : comments;

  const lastItem = items[items.length - 1];

  res.json({
    items,
    nextCursor: lastItem ? lastItem._id : null,
    hasMore,
  });
});
```

---

# 9. Production API Example with Created Date

For feeds, it is often better to sort by `createdAt`.

```js
app.get("/api/comments", async (req, res) => {
  const { cursor, limit = 10 } = req.query;

  const query = {};

  if (cursor) {
    query.createdAt = {
      $lt: new Date(cursor),
    };
  }

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) + 1);

  const hasMore = comments.length > limit;

  const items = hasMore ? comments.slice(0, limit) : comments;

  const lastItem = items[items.length - 1];

  res.json({
    items,
    nextCursor: lastItem ? lastItem.createdAt : null,
    hasMore,
  });
});
```

---

# 10. How to Use This Hook for Nested Comments

For your previous infinite nested comments system, use the same hook inside `CommentNode`.

Example:

```jsx
const {
  items: replies,
  isLoading,
  hasMore,
  lastElementRef,
} = useInfiniteCursorScroll({
  fetchData: ({ cursor, limit }) =>
    fetchRepliesByCursor({
      parentId: comment.id,
      cursor,
      limit,
    }),
  limit: 5,
  enabled: showReplies,
});
```

Then render replies:

```jsx
{
  replies.map((reply, index) => {
    const isLastReply = index === replies.length - 1;

    return (
      <CommentNode
        key={reply.id}
        ref={isLastReply ? lastElementRef : null}
        comment={reply}
      />
    );
  });
}
```

For recursive components, you may need `forwardRef`.

---

# 11. `forwardRef` Version for Recursive CommentNode

```jsx
import { forwardRef } from "react";

const CommentNode = forwardRef(function CommentNode({ comment }, ref) {
  return (
    <div ref={ref} className="comment-card">
      <strong>{comment.author}</strong>
      <p>{comment.text}</p>
    </div>
  );
});

export default CommentNode;
```

---

# 12. Important Performance Optimisations

## 1. Use Cursor Pagination

Better than page pagination for frequently changing data.

```txt
Avoids duplicate/missing items when new records are inserted
```

---

## 2. Use IntersectionObserver

Avoid scroll event listeners like this:

```js
window.addEventListener("scroll", handleScroll);
```

IntersectionObserver is more efficient.

---

## 3. Prevent Duplicate API Calls

This guard is important:

```js
if (isLoading || !hasMore) return;
```

Without this, the same API can be called multiple times.

---

## 4. Abort Previous Requests

```js
abortControllerRef.current.abort();
```

This prevents race conditions when a component unmounts or reloads.

---

## 5. Deduplicate Items

```js
const existingIds = new Set(prevItems.map((item) => item.id));
```

This prevents duplicate rendering if the API returns overlapping records.

---

## 6. Root Margin for Better UX

```js
rootMargin: "200px";
```

This loads the next set before the user reaches the exact bottom.

---

## 7. Use React Query in Production

For a real project, you can use:

```bash
npm install @tanstack/react-query
```

React Query gives:

```txt
Caching
Retry
Deduplication
Background refetch
Pagination support
Loading/error state management
```

---

# 13. React Query Alternative

```jsx
import { useInfiniteQuery } from "@tanstack/react-query";

function useCommentsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam = null }) =>
      fetchCommentsByCursor({
        cursor: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
}
```

Usage:

```jsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useCommentsInfiniteQuery();

const comments = data?.pages.flatMap((page) => page.items) || [];
```

---

# 14. Interview Explanation

You can explain it like this:

> I would build infinite scroll using a reusable custom hook that combines cursor-based pagination with IntersectionObserver. The backend returns items, nextCursor, and hasMore. The hook stores accumulated items, current cursor, loading state, error state, and hasMore. The last rendered item is observed using IntersectionObserver, and when it enters the viewport, the hook fetches the next batch. Cursor pagination is preferred over page-based pagination because it is more stable when new records are inserted or deleted. For production, I would add request cancellation, deduplication, retry logic, caching, and possibly React Query for advanced API state management.

---

# 15. Interview Points to Remember

```txt
1. Cursor pagination is better than offset pagination for dynamic data.
2. IntersectionObserver is better than scroll event listeners.
3. Use hasMore to stop unnecessary API calls.
4. Use isLoading guard to prevent duplicate requests.
5. Use AbortController to cancel stale requests.
6. Deduplicate items when appending.
7. Use rootMargin to preload data before the user reaches the bottom.
8. Use React Query for production-grade caching and retries.
9. Use virtualisation if thousands of records are visible.
10. Keep the hook generic so it can work for comments, feeds, notifications, or products.
```

---

# 30-Second Summary

> A reusable infinite scroll hook should accept a `fetchData` function and internally manage `items`, `cursor`, `hasMore`, `loading`, and `error`. It should use `IntersectionObserver` on the last rendered item to fetch the next cursor batch automatically. Cursor-based pagination is more reliable than page-based pagination for dynamic systems like comments and feeds because it avoids missing or duplicate records when data changes during scrolling.

# 1. Example: Using `useInfiniteCursorScroll` Hook in a Component

Imagine you're building a **LinkedIn/Reddit-style feed**.

## API

```js
// api/postsApi.js

export async function fetchPosts({ cursor, limit, signal }) {
  const response = await fetch(
    `/api/posts?cursor=${cursor ?? ""}&limit=${limit}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  return response.json();
}
```

---

## Component

```jsx
import { useInfiniteCursorScroll } from "../hooks/useInfiniteCursorScroll";
import { fetchPosts } from "../api/postsApi";

function PostFeed() {
  const {
    items: posts,
    lastElementRef,
    isLoading,
    error,
    hasMore,
    loadMore,
  } = useInfiniteCursorScroll({
    fetchData: fetchPosts,
    limit: 10,
  });

  return (
    <div>
      <h2>Posts</h2>

      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return (
          <div
            key={post.id}
            ref={isLast ? lastElementRef : null}
            className="post-card"
          >
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </div>
        );
      })}

      {isLoading && <p>Loading...</p>}

      {error && (
        <div>
          <p>{error}</p>

          <button onClick={loadMore}>Retry</button>
        </div>
      )}

      {!hasMore && <p>No more results</p>}
    </div>
  );
}

export default PostFeed;
```

---

# 2. Production-Level Error Handling

A Senior React Developer should handle:

```txt
✅ Network errors
✅ Timeout errors
✅ Server errors (500)
✅ Authorisation errors (401)
✅ Not Found (404)
✅ Request cancellation
✅ Retry mechanism
```

---

## Improve Hook Error Handling

Current:

```js
catch(err){
  setError(err.message);
}
```

Better:

```js
catch (error) {

  if (error.name === "AbortError") {
    return;
  }

  if (error.response?.status === 401) {
    setError("Please login again.");
  }
  else if (error.response?.status === 404) {
    setError("Data not found.");
  }
  else if (error.response?.status >= 500) {
    setError(
      "Server error. Please try later."
    );
  }
  else {
    setError(
      error.message ||
      "Unexpected error"
    );
  }
}
```

---

# 3. Automatic Retry Implementation

Users may have unstable internet.

Instead of instantly failing:

```txt
Call API
↓
Error
↓
Retry Automatically
```

---

## Retry State

```js
const retryCountRef = useRef(0);

const MAX_RETRIES = 3;
```

---

## Retry Logic

```js
catch (error) {

  if (
    retryCountRef.current <
    MAX_RETRIES
  ) {

    retryCountRef.current++;

    setTimeout(() => {
      loadMore();
    }, 1000);

    return;
  }

  setError(error.message);
}
```

---

## Exponential Backoff (Best Practice)

Instead of:

```txt
1s
1s
1s
```

Use:

```txt
1s
2s
4s
```

---

```js
const delay = 1000 * Math.pow(2, retryCountRef.current);

setTimeout(() => {
  loadMore();
}, delay);
```

---

# 4. Manual Retry Button

Even with auto retry, users should retry manually.

```jsx
{
  error && (
    <div className="error-box">
      <p>{error}</p>

      <button
        onClick={() => {
          setError(null);
          loadMore();
        }}
      >
        Retry
      </button>
    </div>
  );
}
```

---

# 5. Advanced Error Recovery

### Offline Detection

```js
useEffect(() => {
  function handleOnline() {
    setError(null);
    loadMore();
  }

  window.addEventListener("online", handleOnline);

  return () => window.removeEventListener("online", handleOnline);
}, []);
```

Flow:

```txt
Internet Off
↓
Show Error
↓
Internet Back
↓
Auto Refetch
```

---

# 6. Performance Optimisations

These are the points interviewers expect from a 10+ year React Lead.

---

## Optimisation 1: Memoise List Items

Without memoisation:

```txt
New data loaded
↓
Entire list rerenders
```

---

```jsx
const PostCard = React.memo(function PostCard({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
    </div>
  );
});
```

---

## Optimisation 2: Stable Functions

```jsx
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

Avoid:

```txt
Creating new functions
on every render
```

---

## Optimisation 3: Virtualisation

For:

```txt
10,000 Posts
```

Never render all DOM nodes.

Use:

```bash
npm install react-window
```

Example:

```jsx
import { FixedSizeList } from "react-window";
```

Result:

```txt
10000 records
↓
20 DOM nodes rendered
```

Huge performance gain.

---

## Optimisation 4: Request Deduplication

Current hook already prevents:

```js
if (isLoading) {
  return;
}
```

This avoids:

```txt
Multiple API calls
for same cursor
```

---

## Optimisation 5: Deduplicate Response Data

```js
const uniqueItems = response.items.filter((item) => !existingIds.has(item.id));
```

Avoids:

```txt
Duplicate records
Duplicate rendering
```

---

## Optimisation 6: Observer Reuse

Bad:

```txt
Create observer
every render
```

Better:

```js
observerRef.current;
```

Store it once:

```js
const observerRef = useRef(null);
```

---

## Optimisation 7: Use AbortController

Cancel stale requests.

```js
abortController.current.abort();
```

Prevents:

```txt
Race conditions
Memory leaks
Outdated responses
```

---

## Optimisation 8: Prefetch Before Bottom

Instead of:

```js
rootMargin: "0px";
```

Use:

```js
rootMargin: "300px";
```

Result:

```txt
Load next page before
user reaches bottom
```

Feels faster.

---

## Optimisation 9: Cache Pages

Example:

```js
const cache = useRef(new Map());
```

Store:

```js
cursor → response
```

Avoids re-fetching previously loaded pages.

---

## Optimisation 10: React Query (Best Choice)

For enterprise applications:

```bash
npm install
@tanstack/react-query
```

Benefits:

```txt
✓ Caching
✓ Retry
✓ Background refresh
✓ Pagination
✓ Stale-while-revalidate
✓ Deduplication
✓ Prefetching
```

---

# Complete Senior-Level Hook Enhancements

Your hook should ideally support:

```ts
{
  (items,
    error,
    loading,
    hasMore,
    cursor,
    reset,
    loadMore,
    retry,
    cache,
    prefetch,
    abort,
    dedupe,
    observerOptions,
    maxRetries);
}
```

---

# Interview Answer (1 Minute)

> "I would implement infinite scrolling using a reusable custom hook that combines `IntersectionObserver` with cursor-based pagination. The hook would manage items, cursor, loading state, errors, retries, and request cancellation. To improve reliability, I'd add exponential backoff retry logic, AbortController support, duplicate-response protection, and manual retry actions. For performance, I'd use React.memo, useCallback, virtualisation with react-window, prefetching via rootMargin, caching, and React Query for production-grade data fetching. Cursor-based pagination is preferred over offset pagination because it remains consistent even when new records are inserted while the user is scrolling."
> For a **Senior React interview**, exponential backoff is a strong topic because it prevents your application from overwhelming the server during temporary failures.

---

# Why Exponential Backoff?

Instead of retrying immediately:

```txt
Request Failed
↓
Retry after 1 second
↓
Retry after 1 second
↓
Retry after 1 second
```

Use:

```txt
Attempt 1 → 1s
Attempt 2 → 2s
Attempt 3 → 4s
Attempt 4 → 8s
```

This:

✅ Reduces server pressure

✅ Handles transient network issues

✅ Prevents API rate-limit violations

✅ Improves application resilience

---

# Basic Retry Utility

Create a reusable retry helper:

```jsx
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

# Generic Exponential Backoff Function

```jsx
async function retryWithBackoff(apiCall, maxRetries = 3) {
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      if (retries === maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, retries);

      console.log(`Retry ${retries + 1} after ${delay}ms`);

      await sleep(delay);

      retries++;
    }
  }
}
```

---

# Example Delays

```js
retries = 0 => 1000ms
retries = 1 => 2000ms
retries = 2 => 4000ms
retries = 3 => 8000ms
```

---

# Integrate Into Infinite Scroll Hook

Current code:

```jsx
const response = await fetchData({
  cursor,
  limit,
  signal,
});
```

Replace with:

```jsx
const response = await retryWithBackoff(
  () =>
    fetchData({
      cursor,
      limit,
      signal,
    }),
  3,
);
```

---

# Production Version With AbortController Support

```jsx
async function retryWithBackoff(
  apiCall,
  { retries = 3, baseDelay = 1000, signal } = {},
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }

      if (attempt === retries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, delay);

        signal?.addEventListener("abort", () => {
          clearTimeout(timeoutId);

          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    }
  }
}
```

---

# Full Hook Example

```jsx
const loadMore = useCallback(async () => {
  if (isLoading || !hasMore) {
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const controller = new AbortController();

    abortController.current = controller;

    const result = await retryWithBackoff(
      () =>
        fetchData({
          cursor,
          limit,
          signal: controller.signal,
        }),
      {
        retries: 3,
        baseDelay: 1000,
        signal: controller.signal,
      },
    );

    setItems((prev) => [...prev, ...result.items]);

    setCursor(result.nextCursor);

    setHasMore(result.hasMore);
  } catch (error) {
    if (error.name !== "AbortError") {
      setError(error.message);
    }
  } finally {
    setIsLoading(false);
  }
}, [cursor, limit, hasMore, isLoading, fetchData]);
```

---

# Add Retry Count To UI

```jsx
const [retryAttempt, setRetryAttempt] = useState(0);
```

Inside retry logic:

```jsx
setRetryAttempt(attempt + 1);
```

Display:

```jsx
{
  retryAttempt > 0 && <p>Retrying... Attempt {retryAttempt}</p>;
}
```

---

# Better: Exponential Backoff + Jitter

In real production systems (Netflix, AWS, Google), add **jitter**.

Without jitter:

```txt
1000 users fail
↓
All retry at 1s
↓
Server overwhelmed again
```

With jitter:

```txt
User A → 1150ms
User B → 1820ms
User C → 1340ms
```

---

## Jitter Formula

```jsx
const delay = baseDelay * Math.pow(2, attempt);

const jitter = Math.random() * 500;

const finalDelay = delay + jitter;
```

Example:

```txt
Attempt 1 → 1380ms
Attempt 2 → 2450ms
Attempt 3 → 4360ms
```

---

# Retry Only Specific Errors

Never retry:

```txt
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

Retry:

```txt
429 Rate Limit
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
Network Failure
```

Example:

```jsx
const retryableStatusCodes = [429, 500, 502, 503, 504];

if (error.response && !retryableStatusCodes.includes(error.response.status)) {
  throw error;
}
```

---

# Senior-Level Interview Answer

> "I implement retries using exponential backoff with jitter. After each failure, the retry delay grows exponentially (1s, 2s, 4s, 8s) and adds a small random jitter to avoid a thundering herd problem. I only retry transient failures such as network errors, 429, 500, 502, 503, and 504 responses. The retry mechanism respects AbortController so cancelled requests don't continue retrying after unmount. This makes the infinite scroll hook much more resilient and production-ready."

Below is the **full updated `useInfiniteCursorScroll` hook** with:

- Cursor-based pagination
- `IntersectionObserver`
- Exponential backoff retry
- Jitter
- Retryable status-code handling
- `AbortController`
- Manual retry support
- Duplicate item prevention
- Reset support

---

# `src/hooks/useInfiniteCursorScroll.js`

```jsx
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small delay helper that supports AbortController.
 */
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);

    function handleAbort() {
      clearTimeout(timeoutId);
      reject(new DOMException("Request aborted", "AbortError"));
    }

    if (signal) {
      if (signal.aborted) {
        handleAbort();
        return;
      }

      signal.addEventListener("abort", handleAbort, {
        once: true,
      });
    }
  });
}

/**
 * Decide whether an error should be retried.
 *
 * Retry:
 * - Network errors
 * - 429 Too Many Requests
 * - 500, 502, 503, 504 server errors
 *
 * Do not retry:
 * - 400 Bad Request
 * - 401 Unauthorized
 * - 403 Forbidden
 * - 404 Not Found
 */
function isRetryableError(error) {
  if (error.name === "AbortError") {
    return false;
  }

  const status = error.status || error.response?.status;

  // If there is no status, it is usually a network error.
  if (!status) {
    return true;
  }

  return [429, 500, 502, 503, 504].includes(status);
}

/**
 * Retry wrapper using exponential backoff + jitter.
 */
async function retryWithExponentialBackoff(
  apiCall,
  {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    jitter = true,
    signal,
    onRetry,
  } = {},
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }

      const canRetry = isRetryableError(error);

      if (!canRetry || attempt === maxRetries) {
        throw error;
      }

      const exponentialDelay = baseDelay * Math.pow(2, attempt);

      const jitterDelay = jitter ? Math.floor(Math.random() * 500) : 0;

      const finalDelay = Math.min(exponentialDelay + jitterDelay, maxDelay);

      if (onRetry) {
        onRetry({
          attempt: attempt + 1,
          delay: finalDelay,
          error,
        });
      }

      await sleep(finalDelay, signal);
    }
  }
}

/**
 * Reusable infinite scroll hook with cursor-based pagination.
 *
 * Expected fetchData contract:
 *
 * fetchData({
 *   cursor,
 *   limit,
 *   signal
 * })
 *
 * should return:
 *
 * {
 *   items: [],
 *   nextCursor: string | null,
 *   hasMore: boolean
 * }
 */
export function useInfiniteCursorScroll({
  fetchData,
  limit = 10,
  enabled = true,
  maxRetries = 3,
  baseDelay = 1000,
  observerOptions = {
    root: null,
    rootMargin: "250px",
    threshold: 0.1,
  },
  getItemId = (item) => item.id,
}) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [retryDelay, setRetryDelay] = useState(0);

  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const hasFetchedInitialDataRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasMore) {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setRetryAttempt(0);
    setRetryDelay(0);

    setItems((currentItems) => {
      if (currentItems.length === 0) {
        setIsInitialLoading(true);
      }

      return currentItems;
    });

    try {
      const response = await retryWithExponentialBackoff(
        () =>
          fetchData({
            cursor,
            limit,
            signal: controller.signal,
          }),
        {
          maxRetries,
          baseDelay,
          signal: controller.signal,
          onRetry: ({ attempt, delay }) => {
            setRetryAttempt(attempt);
            setRetryDelay(delay);
          },
        },
      );

      setItems((previousItems) => {
        const existingIds = new Set(
          previousItems.map((item) => getItemId(item)),
        );

        const uniqueNewItems = response.items.filter(
          (item) => !existingIds.has(getItemId(item)),
        );

        return [...previousItems, ...uniqueNewItems];
      });

      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
      setRetryAttempt(0);
      setRetryDelay(0);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong while loading data.");
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [
    enabled,
    isLoading,
    hasMore,
    fetchData,
    cursor,
    limit,
    maxRetries,
    baseDelay,
    getItemId,
  ]);

  const retry = useCallback(() => {
    setError(null);
    setRetryAttempt(0);
    setRetryDelay(0);
    loadMore();
  }, [loadMore]);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) {
        return;
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      }, observerOptions);

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, loadMore, observerOptions],
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setItems([]);
    setCursor(null);
    setHasMore(true);
    setIsLoading(false);
    setIsInitialLoading(false);
    setError(null);
    setRetryAttempt(0);
    setRetryDelay(0);

    hasFetchedInitialDataRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!hasFetchedInitialDataRef.current) {
      hasFetchedInitialDataRef.current = true;
      loadMore();
    }
  }, [enabled, loadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items,
    cursor,
    hasMore,

    isLoading,
    isInitialLoading,

    error,
    retry,
    retryAttempt,
    retryDelay,

    loadMore,
    lastElementRef,
    reset,
  };
}
```

---

# Example API Function

Your API function should throw errors properly so the hook can retry only the correct failures.

```jsx
export async function fetchPosts({ cursor, limit, signal }) {
  const queryParams = new URLSearchParams();

  if (cursor) {
    queryParams.set("cursor", cursor);
  }

  queryParams.set("limit", limit);

  const response = await fetch(`/api/posts?${queryParams.toString()}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("Failed to load posts");

    error.status = response.status;

    throw error;
  }

  return response.json();
}
```

Expected response:

```json
{
  "items": [],
  "nextCursor": "cursor_123",
  "hasMore": true
}
```

---

# Example Component Usage

```jsx
import { useInfiniteCursorScroll } from "../hooks/useInfiniteCursorScroll";
import { fetchPosts } from "../api/postsApi";

export default function PostFeed() {
  const {
    items: posts,
    isLoading,
    isInitialLoading,
    error,
    hasMore,
    retry,
    retryAttempt,
    retryDelay,
    lastElementRef,
  } = useInfiniteCursorScroll({
    fetchData: fetchPosts,
    limit: 10,
    maxRetries: 3,
    baseDelay: 1000,
  });

  if (isInitialLoading) {
    return <p>Loading posts...</p>;
  }

  return (
    <section>
      <h1>Posts</h1>

      {posts.map((post, index) => {
        const isLastItem = index === posts.length - 1;

        return (
          <article
            key={post.id}
            ref={isLastItem ? lastElementRef : null}
            className="post-card"
          >
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </article>
        );
      })}

      {isLoading && <p>Loading more posts...</p>}

      {retryAttempt > 0 && (
        <p>
          Retrying attempt {retryAttempt}. Next retry in{" "}
          {Math.round(retryDelay / 1000)}s.
        </p>
      )}

      {error && (
        <div className="error-box">
          <p>{error}</p>

          <button type="button" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && <p>No more posts.</p>}
    </section>
  );
}
```

---

# How Retry Works

If the API fails, the hook retries like this:

```txt
Attempt 1 fails
↓
Wait around 1s + jitter
↓
Attempt 2 fails
↓
Wait around 2s + jitter
↓
Attempt 3 fails
↓
Wait around 4s + jitter
↓
Show final error
```

The delay is calculated here:

```jsx
const exponentialDelay = baseDelay * Math.pow(2, attempt);

const jitterDelay = Math.floor(Math.random() * 500);

const finalDelay = exponentialDelay + jitterDelay;
```

---

# Interview Explanation

You can explain it like this:

> I added exponential backoff retry to the infinite scroll hook by wrapping the API call inside a retry utility. The retry delay increases after every failure, such as 1 second, 2 seconds and 4 seconds. I also added jitter to avoid multiple clients retrying at the same time. The hook retries only transient failures like network issues, 429 and 5xx errors. It does not retry 400, 401, 403 or 404 errors. AbortController is also integrated so retries stop immediately if the component unmounts or the request is cancelled.

# Search with Autocomplete in React JS

## Complete Frontend System Design + Detailed Explanation

This is one of the most common **React Frontend System Design Interview Questions** asked for:

- Google Search
- Amazon Search
- YouTube Search
- Netflix Search
- LinkedIn Search

---

# 1. Problem Statement

Build a search component that:

✅ Shows suggestions while typing

✅ Supports keyboard navigation

✅ Debounces API calls

✅ Prevents race conditions

✅ Caches previous searches

✅ Supports mouse selection

✅ Closes on outside click

✅ Handles loading and errors

✅ Accessible and scalable

---

# 2. System Design

## Architecture

```txt
Search Input
     │
     ▼
Debounce Hook
     │
     ▼
Search API
     │
     ▼
Cache Layer
     │
     ▼
Suggestions State
     │
     ▼
Dropdown Component
     │
     ├── Mouse Selection
     ├── Keyboard Navigation
     └── Outside Click Close
```

---

# 3. State Design

```jsx
const [query, setQuery] = useState("");

const [suggestions, setSuggestions] = useState([]);

const [loading, setLoading] = useState(false);

const [error, setError] = useState(null);

const [activeIndex, setActiveIndex] = useState(-1);

const [isOpen, setIsOpen] = useState(false);
```

---

# 4. Complete Keyboard Navigation

Users expect:

```txt
↓ Move Down

↑ Move Up

Enter Select Item

Escape Close Dropdown
```

---

## Example

Suppose:

```txt
React
Redux
React Query
TypeScript
```

Initial:

```txt
React
Redux
React Query
TypeScript
```

Press ↓

```txt
> React
Redux
React Query
TypeScript
```

Press ↓

```txt
React
> Redux
React Query
TypeScript
```

Press Enter

```txt
Redux
```

Gets selected.

---

## Keyboard Handler

```jsx
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();

      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));

      break;

    case "ArrowUp":
      event.preventDefault();

      setActiveIndex((prev) => Math.max(prev - 1, 0));

      break;

    case "Enter":
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        setQuery(suggestions[activeIndex]);

        setIsOpen(false);
      }

      break;

    case "Escape":
      setIsOpen(false);

      break;

    default:
      break;
  }
}
```

---

# 5. Visual Highlight

```jsx
<li
  className={
    activeIndex === index
      ? "active"
      : ""
  }
>
```

CSS:

```css
.active {
  background: #2563eb;
  color: white;
}
```

---

# 6. Caching Search Results

One of the most important interview topics.

---

## Problem

User searches:

```txt
react
```

API Call

Later:

```txt
react
```

Again

Without cache:

```txt
Second API Call
```

Wasteful.

---

## Solution

Store results.

```jsx
const cacheRef = useRef({});
```

---

### Data Structure

```js
{
  react: [
    "React",
    "React Query"
  ],

  redux: [
    "Redux Toolkit",
    "Redux Saga"
  ]
}
```

---

## Before API Call

```jsx
if (cacheRef.current[query]) {
  setSuggestions(cacheRef.current[query]);

  return;
}
```

---

## After Response

```jsx
cacheRef.current[query] = response;
```

Flow:

```txt
Search React
        ↓
API
        ↓
Cache

Search React Again
        ↓
Cache Hit
        ↓
Instant Result
```

---

# 7. Recent Searches Feature

Modern applications maintain search history.

---

## Store Last Searches

```jsx
const [recentSearches, setRecentSearches] = useState([]);
```

---

## Save On Select

```jsx
function saveRecentSearch(query) {
  setRecentSearches((prev) => {
    const unique = [query, ...prev.filter((item) => item !== query)];

    return unique.slice(0, 5);
  });
}
```

---

## Example

```txt
React
Redux
TypeScript
Node
Next
```

Show when input is empty:

```jsx
{
  !query && recentSearches.map((search) => <li key={search}>{search}</li>);
}
```

---

# 8. LocalStorage Persistence

So searches survive refresh.

---

## Save

```jsx
useEffect(() => {
  localStorage.setItem("recent-searches", JSON.stringify(recentSearches));
}, [recentSearches]);
```

---

## Load

```jsx
useEffect(() => {
  const saved = localStorage.getItem("recent-searches");

  if (saved) {
    setRecentSearches(JSON.parse(saved));
  }
}, []);
```

---

# 9. Outside Click Handling

Very important interview topic.

---

## Requirement

```txt
Click Outside
       ↓
Close Dropdown
```

---

## Create Ref

```jsx
const containerRef = useRef(null);
```

---

## Detect Outside Click

```jsx
useEffect(() => {
  function handleOutsideClick(event) {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);
```

---

## Attach Ref

```jsx
<div ref={containerRef}>
```

Flow:

```txt
User Clicks
        ↓
Check Click Target
        ↓
Inside Component?
       / \
      Yes No
      /     \
Keep Open  Close
```

---

# 10. Race Condition Handling

Another favourite interview question.

---

## Problem

User Types Quickly

```txt
R
RE
REA
REAC
REACT
```

Requests:

```txt
Request 1
Request 2
Request 3
Request 4
Request 5
```

Suppose:

```txt
Request 5 returns first
Request 1 returns last
```

Old results overwrite new results.

---

## Fix With AbortController

```jsx
const abortRef = useRef(null);
```

---

Before new request:

```jsx
abortRef.current?.abort();
```

---

Create new controller:

```jsx
const controller = new AbortController();

abortRef.current = controller;
```

---

API Call:

```jsx
fetch(url, {
  signal: controller.signal,
});
```

Only latest request survives.

---

# 11. Complete UI Behaviour

```txt
User types
      ↓
Debounce 300ms
      ↓
Check Cache
      ↓
Cache Hit?
   /      \
 Yes      No
 /          \
Results    API Call
             ↓
       Abort Controller
             ↓
         Response
             ↓
         Suggestions
             ↓
        Open Dropdown
             ↓
  ↑ ↓ Enter Escape Supported
             ↓
     Save Recent Search
             ↓
      LocalStorage Cache
```

---

# 12. Accessibility (Must Mention in Interviews)

Input:

```jsx
<input role="combobox" aria-expanded={isOpen} aria-autocomplete="list" />
```

Dropdown:

```jsx
<ul role="listbox">
```

Option:

```jsx
<li role="option">
```

This improves screen reader support.

---

# 13. Performance Optimisations

### 1. Debouncing

```jsx
useDebounce(query, 300);
```

Reduce API calls.

---

### 2. Request Cancellation

```jsx
AbortController;
```

Prevent stale data.

---

### 3. Cache

```jsx
cacheRef.current;
```

O(1) lookup.

---

### 4. Memoized Components

```jsx
React.memo();
```

Avoid rerenders.

---

### 5. Virtualization

For huge datasets

```bash
react-window
```

Render only visible rows.

---

### 6. Server Side Search

Never download:

```txt
100000 products
```

Search on server.

---

# Interview Questions

## Why debounce and not throttle?

**Debounce**

```txt
Wait for typing to stop
```

Best for search.

---

**Throttle**

```txt
Run every N milliseconds
```

Best for scrolling.

---

## Why cache?

Avoid repeated API calls.

```txt
API → O(Network)

Cache → O(1)
```

---

## Why AbortController?

Prevent race conditions.

---

## Why use refs for cache?

```jsx
useRef();
```

Because cache changes should not trigger rerenders.

---

## Why outside click handling?

Improves usability and mimics real-world search behaviour.

---

# 2-Minute Senior-Level Interview Answer

> "I would build autocomplete using a controlled input, debounce hook, cache layer, and AbortController. User input is debounced before triggering API calls to reduce network traffic. Search results are cached in memory using a ref, enabling instant responses for repeated queries. Keyboard interactions support Arrow Up, Arrow Down, Enter, and Escape for accessibility and usability. Outside click detection closes the dropdown when focus moves away. To prevent race conditions, previous requests are cancelled using AbortController. For production-scale applications, I'd add React Query, server-side search, Redis caching, virtualisation, accessibility roles, and recent-search persistence using localStorage."

# Search with Autocomplete in React JS

## Complete Frontend System Design – Detailed Interview Explanation

This is a **very common Senior React / Frontend System Design question**.

Companies ask it because it tests:

- React fundamentals
- State management
- API handling
- Performance optimisation
- Accessibility
- User Experience
- Real-world scaling

Examples:

```txt
Google Search
Amazon Search
Flipkart Search
YouTube Search
LinkedIn Search
GitHub Search
```

---

# Step 1: Understand the Requirement

Suppose the interviewer says:

> Build a search box that shows suggestions while the user types.

---

## Functional Requirements

### User should be able to:

```txt
1. Type in search box
2. See suggestions
3. Navigate suggestions using keyboard
4. Select suggestion
5. Close dropdown
6. Search quickly
7. Handle loading/error states
```

Example:

```txt
Input: rea

Suggestions:
-------------
React
React Native
React Query
-------------
```

---

## Non Functional Requirements

These are what senior engineers discuss.

```txt
Fast
Scalable
Accessible
Performant
Reliable
```

---

# Step 2: High-Level Architecture

```txt
User Types
    │
    ▼
Input Box
    │
    ▼
Debounce
    │
    ▼
API Call
    │
    ▼
Cache Check
    │
    ▼
Suggestions State
    │
    ▼
Dropdown UI
```

---

# Step 3: React Component Design

```txt
App
 │
 └── SearchAutocomplete
          │
          ├── SearchInput
          ├── SuggestionsList
          └── SuggestionItem
```

Interview tip:

> Keep UI and business logic separate.

---

# Step 4: State Design

Before writing code think about states.

```jsx
const [query, setQuery] = useState("");

const [suggestions, setSuggestions] = useState([]);

const [loading, setLoading] = useState(false);

const [error, setError] = useState(null);

const [isOpen, setIsOpen] = useState(false);

const [activeIndex, setActiveIndex] = useState(-1);
```

---

### Why Each State Exists?

## query

Stores user input.

```txt
User types:
react

query = "react"
```

---

## suggestions

Stores results from API.

```txt
[
 "React",
 "React Native",
 "React Query"
]
```

---

## loading

Shows spinner.

```txt
Loading...
```

while waiting for API.

---

## error

If API fails.

```txt
Unable to fetch suggestions
```

---

## isOpen

Controls dropdown visibility.

```txt
true => show dropdown

false => hide dropdown
```

---

## activeIndex

Needed for keyboard navigation.

```txt
Arrow Down
Arrow Up
Enter
```

Example:

```txt
0 => React
1 => Redux
2 => React Query
```

---

# Step 5: Input Event Flow

When user types:

```txt
R
RE
REA
REAC
REACT
```

Input event fires five times.

---

Without optimisation:

```txt
5 API calls
```

Bad.

---

# Step 6: Debouncing

## Problem

User typing:

```txt
R
RE
REA
REAC
REACT
```

generates:

```txt
5 API calls
```

---

## Solution

Debounce.

Wait for user to stop typing.

```txt
Wait 300ms
```

Then call API.

---

### Flow

```txt
User Types
       ↓
Pause 300ms
       ↓
API Call
```

Instead of

```txt
5 API calls
```

we get:

```txt
1 API call
```

---

# Step 7: API Request

After debounce:

```jsx
GET /search?q=react
```

Response:

```json
{
  "suggestions": ["React", "React Native", "React Query"]
}
```

---

# Step 8: Prevent Race Conditions

Interviewers LOVE this question.

---

## Problem

User types:

```txt
r
re
rea
react
```

Requests:

```txt
Req1
Req2
Req3
Req4
```

---

Suppose:

```txt
Req4 returns in 1 sec
Req1 returns in 3 sec
```

Result:

```txt
Old response overwrites new response
```

Wrong suggestions displayed.

---

## Solution

AbortController

Before new request:

```jsx
abortController.abort();
```

Cancel previous request.

Start new request.

```jsx
const controller = new AbortController();
```

Now only the latest request survives.

---

# Step 9: Caching Search Results

Freshers usually miss this.

Senior developers always discuss it.

---

Search:

```txt
react
```

API returns:

```txt
React
React Native
React Query
```

---

Store it inside cache.

```js
{
 react: [...]
}
```

---

User searches again:

```txt
react
```

Instead of API:

```txt
Cache Hit
```

Instant response.

---

### Cache Structure

```jsx
const cacheRef = useRef({});
```

Stores:

```js
{
  react: [...],
  redux: [...]
}
```

---

### Flow

```txt
Input Query
      │
      ▼
Cache Exists?
    /   \
  Yes    No
  /        \
Return     API Call
Result
```

---

# Step 10: Recent Search History

Used by:

```txt
Google
Amazon
YouTube
Netflix
```

---

Store latest searches:

```jsx
["React", "Redux", "TypeScript"];
```

---

When input empty:

```txt
Show Recent Searches
```

Example:

```txt
Recent Searches

React
Redux
TypeScript
```

---

Persist using:

```jsx
localStorage;
```

So searches survive refresh.

---

# Step 11: Dropdown Rendering

When suggestions arrive:

```jsx
<ul>
  <li>React</li>
  <li>Redux</li>
</ul>
```

Result:

```txt
----------------
 React
 Redux
 React Query
----------------
```

---

# Step 12: Keyboard Navigation

Industry-standard behaviour.

---

## Arrow Down

Move selection down.

```txt
React
Redux
React Query
```

Press:

```txt
↓
```

Result:

```txt
> React
Redux
React Query
```

---

Press again:

```txt
React
> Redux
React Query
```

---

Implementation:

```jsx
setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
```

---

## Arrow Up

Move upward.

```jsx
setActiveIndex((prev) => Math.max(prev - 1, 0));
```

---

## Enter

Select current suggestion.

```txt
User presses Enter
```

Result:

```txt
Redux
```

added to input box.

---

## Escape

Close dropdown.

```txt
Escape
↓
Dropdown Closed
```

---

# Step 13: Highlight Active Item

Current selection:

```txt
React
> Redux
React Query
```

CSS:

```css
.active {
  background: blue;
  color: white;
}
```

---

# Step 14: Outside Click Handling

Another favourite interview topic.

---

## Requirement

User clicks somewhere else.

```txt
Search Box
```

should close.

---

### Example

```txt
Search Open
      ↓
Click Outside
      ↓
Hide Dropdown
```

---

### Solution

Create ref.

```jsx
const containerRef = useRef(null);
```

---

Add event listener.

```jsx
document.addEventListener("mousedown", handleClick);
```

---

Check:

```jsx
containerRef.current.contains(event.target);
```

---

If false:

```jsx
setIsOpen(false);
```

---

Flow:

```txt
User Click
      │
      ▼
Inside Component?
     /     \
   Yes      No
   /         \
Keep Open    Close
```

---

# Step 15: Accessibility

Senior-level discussion.

Input:

```jsx
<input role="combobox" aria-expanded={isOpen} aria-autocomplete="list" />
```

---

List:

```jsx
<ul role="listbox">
```

---

Items:

```jsx
<li role="option">
```

Makes autocomplete usable for:

```txt
Screen Readers
Keyboard Users
Accessibility Tools
```

---

# Step 16: Performance Optimisations

### 1. Debounce

Reduce API calls.

```txt
100 calls
↓
10 calls
```

---

### 2. AbortController

Prevent stale data.

---

### 3. Cache

Repeated searches:

```txt
O(1)
```

lookup.

---

### 4. React.memo

Avoid rerendering suggestion rows.

```jsx
export default React.memo(SuggestionItem);
```

---

### 5. useCallback

Avoid recreating handlers.

```jsx
const handleSelect =
 useCallback(...)
```

---

### 6. Virtualisation

If API returns:

```txt
10000 results
```

Use:

```txt
react-window
react-virtualized
```

---

### 7. Server Side Search

Never download:

```txt
100,000 products
```

Search on backend.

---

# Complete User Flow

```txt
User Types "rea"
          │
          ▼
Debounce 300ms
          │
          ▼
Check Cache
          │
     ┌────┴────┐
     │         │
 Cache Hit   Cache Miss
     │         │
     ▼         ▼
 Results     API Call
               │
               ▼
      Abort Previous Request
               │
               ▼
          Suggestions
               │
               ▼
        Open Dropdown
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
 Arrow     Mouse Click   Enter
 Down         Select     Select
   │           │           │
   └──────► Update Input ◄─┘
               │
               ▼
      Save Recent Search
               │
               ▼
         LocalStorage
```

# 60-Second Senior React Interview Answer

> "I would design autocomplete using a controlled input, debounced search requests, and a cache layer. As the user types, I would debounce input to reduce API calls and use AbortController to cancel stale requests, preventing race conditions. Search results would be cached in memory for instant repeat lookups and recent searches would be persisted in localStorage. The dropdown would support keyboard navigation using Arrow Up, Arrow Down, Enter, and Escape keys. I'd handle outside clicks using a ref and document event listeners to close the dropdown. For production-scale systems, I'd add React Query, server-side search, Redis caching, accessibility support, and virtualisation for large result sets."

For React interviews, especially at **Senior React Developer / Project Lead** level, interviewers usually expect a **complete working autocomplete component** with:

✅ Debouncing  
✅ Keyboard Navigation  
✅ Caching  
✅ Recent Searches  
✅ Outside Click Handling  
✅ Request Cancellation  
✅ Loading State  
✅ Error Handling

---

# Project Structure

```txt
src/
├── App.jsx
├── hooks/
│   ├── useDebounce.js
│   └── useAutocomplete.js
├── api/
│   └── searchApi.js
├── components/
│   └── SearchAutocomplete.jsx
└── styles.css
```

---

# Step 1: Search API

## api/searchApi.js

```jsx
const DATA = [
  "React",
  "Redux",
  "React Query",
  "React Native",
  "Node.js",
  "Next.js",
  "Nest.js",
  "JavaScript",
  "TypeScript",
  "Angular",
  "Vue",
  "Svelte",
  "Express",
  "MongoDB",
];

export async function searchProducts(query, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const filtered = DATA.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      );

      resolve(filtered);
    }, 500);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);

      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
```

---

# Step 2: Debounce Hook

## hooks/useDebounce.js

```jsx
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

# Step 3: Autocomplete Hook

## hooks/useAutocomplete.js

```jsx
import { useState, useEffect, useRef } from "react";

import { useDebounce } from "./useDebounce";
import { searchProducts } from "../api/searchApi";

export function useAutocomplete() {
  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  const [isOpen, setIsOpen] = useState(false);

  const [recentSearches, setRecentSearches] = useState([]);

  const cacheRef = useRef({});
  const abortRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load Recent Searches

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches");

    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save Recent Searches

  useEffect(() => {
    localStorage.setItem("recent-searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        setLoading(true);
        setError(null);

        // Cache hit

        if (cacheRef.current[debouncedQuery]) {
          setSuggestions(cacheRef.current[debouncedQuery]);

          setIsOpen(true);
          return;
        }

        // Abort old request

        abortRef.current?.abort();

        const controller = new AbortController();

        abortRef.current = controller;

        const result = await searchProducts(debouncedQuery, controller.signal);

        cacheRef.current[debouncedQuery] = result;

        setSuggestions(result);
        setIsOpen(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  function saveRecentSearch(value) {
    setRecentSearches((prev) => {
      const unique = [value, ...prev.filter((item) => item !== value)];

      return unique.slice(0, 5);
    });
  }

  return {
    query,
    setQuery,

    suggestions,

    loading,
    error,

    activeIndex,
    setActiveIndex,

    isOpen,
    setIsOpen,

    recentSearches,
    saveRecentSearch,
  };
}
```

---

# Step 4: SearchAutocomplete Component

## components/SearchAutocomplete.jsx

```jsx
import { useRef, useEffect } from "react";

import { useAutocomplete } from "../hooks/useAutocomplete";

export default function SearchAutocomplete() {
  const {
    query,
    setQuery,

    suggestions,

    loading,
    error,

    activeIndex,
    setActiveIndex,

    isOpen,
    setIsOpen,

    recentSearches,
    saveRecentSearch,
  } = useAutocomplete();

  const containerRef = useRef(null);

  // Outside click

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSelect(value) {
    setQuery(value);

    saveRecentSearch(value);

    setIsOpen(false);
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));

        break;

      case "ArrowUp":
        event.preventDefault();

        setActiveIndex((prev) => Math.max(prev - 1, 0));

        break;

      case "Enter":
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }

        break;

      case "Escape":
        setIsOpen(false);
        break;

      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="autocomplete">
      <input
        type="text"
        value={query}
        placeholder="Search technology..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {isOpen && (
        <ul className="dropdown">
          {!query &&
            recentSearches.map((search) => (
              <li key={search} onClick={() => handleSelect(search)}>
                🕒 {search}
              </li>
            ))}

          {suggestions.map((item, index) => (
            <li
              key={item}
              className={activeIndex === index ? "active" : ""}
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

# Step 5: App Component

## App.jsx

```jsx
import SearchAutocomplete from "./components/SearchAutocomplete";

import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <h1>React Autocomplete</h1>

      <SearchAutocomplete />
    </div>
  );
}
```

---

# Step 6: CSS

## styles.css

```css
body {
  font-family: Arial;
}

.app {
  width: 500px;
  margin: 50px auto;
}

.autocomplete {
  position: relative;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.dropdown {
  list-style: none;

  padding: 0;
  margin: 0;

  border: 1px solid #ccc;

  position: absolute;

  width: 100%;

  background: white;

  max-height: 250px;

  overflow-y: auto;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background: #f5f5f5;
}

.active {
  background: #2563eb;
  color: white;
}
```

---

# Full Flow Explained

```txt
User Types
      │
      ▼
query updated
      │
      ▼
Debounce waits 300ms
      │
      ▼
Check Cache
      │
 ┌────┴─────┐
 │          │
Yes         No
 │          │
 ▼          ▼
Return     API Call
Cache      Search API
Result
 │          │
 └────┬─────┘
      ▼
 suggestions
      ▼
Open Dropdown
      ▼
Arrow Up/Down
      ▼
Enter Click
      ▼
Select Item
      ▼
Recent Search Saved
      ▼
LocalStorage
```

# Senior React Interview Answer

> "I built autocomplete using a controlled component, custom debounce hook, request cancellation through AbortController, in-memory caching using useRef, recent-search persistence in localStorage, keyboard navigation with Arrow keys and Enter, and outside-click detection using refs. The design prevents excessive API calls, eliminates race conditions, provides instant cached responses, and offers a production-ready user experience. For larger systems I would add React Query, virtualisation, server-side search indexing, and Redis caching."

Absolutely. For a **Senior React / Accessibility Interview**, you should integrate the **WAI-ARIA Combobox Pattern** directly into the autocomplete component.

---

# Accessibility Goals

Support:

✅ Screen Readers (NVDA, JAWS, VoiceOver)

✅ Keyboard Users

✅ WCAG Compliance

✅ Semantic Roles

✅ Proper Focus Management

---

# Updated `SearchAutocomplete.jsx` with Full ARIA Support

```jsx
import { useRef, useEffect } from "react";

import { useAutocomplete } from "../hooks/useAutocomplete";

export default function SearchAutocomplete() {
  const {
    query,
    setQuery,

    suggestions,

    loading,
    error,

    activeIndex,
    setActiveIndex,

    isOpen,
    setIsOpen,

    recentSearches,
    saveRecentSearch,
  } = useAutocomplete();

  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setIsOpen]);

  function handleSelect(value) {
    setQuery(value);
    saveRecentSearch(value);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));

        break;

      case "ArrowUp":
        event.preventDefault();

        setActiveIndex((prev) => Math.max(prev - 1, 0));

        break;

      case "Enter":
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }

        break;

      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="autocomplete">
      {/* Accessible Label */}
      <label htmlFor="search-input" className="sr-only">
        Search Technology
      </label>

      {/* Accessible Combobox Input */}
      <input
        id="search-input"
        type="text"
        placeholder="Search technology..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-label="Search technologies"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="autocomplete-listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `option-${activeIndex}` : undefined
        }
      />

      {/* Loading State */}
      {loading && (
        <div role="status" aria-live="polite" className="status">
          Loading suggestions...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query && suggestions.length === 0 && (
        <div role="status" aria-live="polite">
          No results found.
        </div>
      )}

      {isOpen && (
        <ul id="autocomplete-listbox" role="listbox" className="dropdown">
          {/* Recent Searches */}

          {!query &&
            recentSearches.map((search, index) => (
              <li
                key={search}
                id={`recent-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "active" : ""}
                onClick={() => handleSelect(search)}
              >
                🕒 {search}
              </li>
            ))}

          {/* Suggestion Results */}

          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? "active" : ""}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Add Screen Reader Only Class

```css
.sr-only {
  position: absolute;

  width: 1px;
  height: 1px;

  padding: 0;
  margin: -1px;

  overflow: hidden;

  clip: rect(0, 0, 0, 0);

  white-space: nowrap;

  border: 0;
}
```

---

## ARIA Roles Explained

## Input

```jsx
role = "combobox";
```

Announces:

```txt
Search technologies
Combo box
```

---

## List

```jsx
role = "listbox";
```

Announces:

```txt
Suggestions list
```

---

## Suggestion

```jsx
role = "option";
```

Each item becomes a selectable option.

---

## Active Item

```jsx
aria - activedescendant;
```

Example:

```txt
Arrow Down
```

Current item:

```txt
Redux
```

Input:

```jsx
aria-activedescendant="option-1"
```

Screen reader announces:

```txt
Redux selected
```

---

## Expanded State

```jsx
aria-expanded="true"
```

Screen reader:

```txt
Expanded
```

When dropdown closes:

```jsx
aria-expanded="false"
```

---

## Loading State

```jsx
role="status"
aria-live="polite"
```

Announces:

```txt
Loading suggestions
```

without interrupting the user.

---

## Error State

```jsx
role = "alert";
```

Immediately announces:

```txt
Error loading suggestions
```

---

# Accessibility Keyboard Flow

```txt
Tab
↓
Focus Input

Arrow Down
↓
Move Selection

Arrow Up
↓
Move Selection

Enter
↓
Select Item

Escape
↓
Close Dropdown

Tab
↓
Move To Next Focusable Element
```

---

# Interview Answer

> "To make the autocomplete accessible, I implemented the WAI-ARIA Combobox pattern. The input uses `role='combobox'` along with `aria-expanded`, `aria-controls`, and `aria-activedescendant`. The dropdown uses `role='listbox'`, and each suggestion uses `role='option'` with `aria-selected`. Loading and empty states are announced through `aria-live` regions, while errors use `role='alert'`. Combined with keyboard navigation and outside-click handling, this makes the component fully accessible to screen-reader and keyboard-only users and aligns with WCAG accessibility guidelines."
