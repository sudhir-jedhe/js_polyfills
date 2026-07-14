Below is a **complete system design + working React JS code** for an **Infinite Nested Comments System**, useful for React interview/system-design rounds.

The idea is: comments can have replies, replies can have more replies, and depth is not hardcoded.

---

# 1. Requirement

Build a comment system like:

```txt
Comment 1
 ├── Reply 1
 │    ├── Reply to Reply 1
 │    │     └── Reply to Reply to Reply...
 └── Reply 2

Comment 2
 └── Reply 1
```

Features:

- Add top-level comment
- Reply to any comment
- Infinite nesting using recursion
- Expand/collapse replies
- Maintain clean state updates
- Avoid deeply nested mutation
- Interview-ready scalable design

---

# 2. High-Level System Design

## Components

```txt
App
 ├── CommentForm
 └── CommentList
      └── CommentNode
            ├── CommentForm
            └── CommentNode
                  └── CommentNode ...
```

## Data Flow

```txt
User adds comment/reply
        ↓
App updates normalised comment store
        ↓
CommentList renders root comments
        ↓
CommentNode recursively renders children
```

---

# 3. Why Normalised State?

Avoid storing comments like this:

```js
[
  {
    id: 1,
    text: "Parent",
    replies: [
      {
        id: 2,
        text: "Child",
        replies: [],
      },
    ],
  },
];
```

This becomes difficult to update when nesting is deep.

Instead, use **normalised structure**:

```js
{
  commentsById: {
    1: {
      id: 1,
      text: "Parent comment",
      parentId: null,
      children: [2]
    },
    2: {
      id: 2,
      text: "Reply comment",
      parentId: 1,
      children: []
    }
  },
  rootIds: [1]
}
```

Benefits:

- Fast lookup by ID
- Easy add/update/delete
- Better for deeply nested comments
- More scalable for real apps

---

# 4. Project Structure

```txt
src/
 ├── App.jsx
 ├── components/
 │    ├── CommentForm.jsx
 │    ├── CommentList.jsx
 │    └── CommentNode.jsx
 ├── data/
 │    └── initialComments.js
 ├── utils/
 │    └── normaliseComments.js
 └── styles.css
```

---

# 5. Complete Code

## `src/data/initialComments.js`

```jsx
export const initialComments = [
  {
    id: "1",
    text: "This is the first top-level comment.",
    author: "Sudhir",
    parentId: null,
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    id: "2",
    text: "This is a reply to the first comment.",
    author: "Amit",
    parentId: "1",
    createdAt: "2026-07-05T10:05:00.000Z",
  },
  {
    id: "3",
    text: "This is a nested reply.",
    author: "Priya",
    parentId: "2",
    createdAt: "2026-07-05T10:10:00.000Z",
  },
  {
    id: "4",
    text: "This is another top-level comment.",
    author: "Ravi",
    parentId: null,
    createdAt: "2026-07-05T10:15:00.000Z",
  },
];
```

---

## `src/utils/normaliseComments.js`

```jsx
export function normaliseComments(comments) {
  const commentsById = {};
  const rootIds = [];

  comments.forEach((comment) => {
    commentsById[comment.id] = {
      ...comment,
      children: [],
    };
  });

  comments.forEach((comment) => {
    if (comment.parentId === null) {
      rootIds.push(comment.id);
    } else {
      const parent = commentsById[comment.parentId];

      if (parent) {
        parent.children.push(comment.id);
      }
    }
  });

  return {
    commentsById,
    rootIds,
  };
}
```

---

## `src/components/CommentForm.jsx`

```jsx
import { useState } from "react";

export default function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
  buttonText = "Post",
}) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) return;

    onSubmit(trimmedText);
    setText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={(event) => setText(event.target.value)}
      />

      <button type="submit">{buttonText}</button>
    </form>
  );
}
```

---

## `src/components/CommentList.jsx`

```jsx
import CommentNode from "./CommentNode";

export default function CommentList({ rootIds, commentsById, addComment }) {
  if (rootIds.length === 0) {
    return (
      <p className="empty-text">No comments yet. Be the first to comment.</p>
    );
  }

  return (
    <div className="comment-list">
      {rootIds.map((commentId) => (
        <CommentNode
          key={commentId}
          commentId={commentId}
          commentsById={commentsById}
          addComment={addComment}
          depth={0}
        />
      ))}
    </div>
  );
}
```

---

## `src/components/CommentNode.jsx`

```jsx
import { useState, memo } from "react";
import CommentForm from "./CommentForm";

function CommentNode({ commentId, commentsById, addComment, depth }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const comment = commentsById[commentId];

  if (!comment) return null;

  const hasReplies = comment.children.length > 0;

  function handleReplySubmit(replyText) {
    addComment({
      text: replyText,
      parentId: comment.id,
    });

    setShowReplyForm(false);
    setShowReplies(true);
  }

  const dynamicMargin = Math.min(depth * 24, 120);

  return (
    <div
      className="comment-node"
      style={{
        marginLeft: `${dynamicMargin}px`,
      }}
    >
      <div className="comment-card">
        <div className="comment-header">
          <strong>{comment.author}</strong>
          <span>{new Date(comment.createdAt).toLocaleString()}</span>
        </div>

        <p className="comment-text">{comment.text}</p>

        <div className="comment-actions">
          <button onClick={() => setShowReplyForm((prev) => !prev)}>
            {showReplyForm ? "Cancel" : "Reply"}
          </button>

          {hasReplies && (
            <button onClick={() => setShowReplies((prev) => !prev)}>
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${comment.children.length})`}
            </button>
          )}
        </div>

        {showReplyForm && (
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder={`Reply to ${comment.author}...`}
            buttonText="Reply"
          />
        )}
      </div>

      {showReplies && hasReplies && (
        <div className="replies">
          {comment.children.map((childId) => (
            <CommentNode
              key={childId}
              commentId={childId}
              commentsById={commentsById}
              addComment={addComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(CommentNode);
```

---

## `src/App.jsx`

```jsx
import { useCallback, useState } from "react";
import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";
import { initialComments } from "./data/initialComments";
import { normaliseComments } from "./utils/normaliseComments";
import "./styles.css";

const initialState = normaliseComments(initialComments);

export default function App() {
  const [commentsById, setCommentsById] = useState(initialState.commentsById);
  const [rootIds, setRootIds] = useState(initialState.rootIds);

  const addComment = useCallback(({ text, parentId = null }) => {
    const newCommentId = crypto.randomUUID();

    const newComment = {
      id: newCommentId,
      text,
      author: "Current User",
      parentId,
      createdAt: new Date().toISOString(),
      children: [],
    };

    setCommentsById((prevCommentsById) => {
      const updatedCommentsById = {
        ...prevCommentsById,
        newComment,
      };

      if (parentId !== null) {
        const parentComment = prevCommentsById[parentId];

        updatedCommentsById[parentId] = {
          ...parentComment,
          children: [...parentComment.children, newCommentId],
        };
      }

      return updatedCommentsById;
    });

    if (parentId === null) {
      setRootIds((prevRootIds) => [...prevRootIds, newCommentId]);
    }
  }, []);

  function handleTopLevelCommentSubmit(text) {
    addComment({
      text,
      parentId: null,
    });
  }

  return (
    <main className="app">
      <section className="comments-container">
        <h1>Infinite Nested Comments</h1>
        <p className="subtitle">
          Add comments and reply to any level using recursive rendering.
        </p>

        <CommentForm
          onSubmit={handleTopLevelCommentSubmit}
          placeholder="Write a top-level comment..."
          buttonText="Post Comment"
        />

        <CommentList
          rootIds={rootIds}
          commentsById={commentsById}
          addComment={addComment}
        />
      </section>
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
  color: #1f2937;
}

.app {
  min-height: 100vh;
  padding: 32px;
}

.comments-container {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  margin-top: 8px;
  color: #6b7280;
}

.comment-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-form textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.comment-form textarea:focus {
  outline: 2px solid #2563eb;
  border-color: #2563eb;
}

.comment-form button {
  align-self: flex-start;
  padding: 8px 16px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.comment-form button:hover {
  background: #1d4ed8;
}

.comment-list {
  margin-top: 24px;
}

.comment-node {
  margin-top: 16px;
}

.comment-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #2563eb;
  border-radius: 8px;
  padding: 14px;
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

.comment-text {
  margin: 10px 0;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.comment-actions button {
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}

.comment-actions button:hover {
  text-decoration: underline;
}

.replies {
  margin-top: 8px;
}

.empty-text {
  margin-top: 24px;
  color: #6b7280;
}
```

---

# 6. How Recursion Works Here

This part is the core logic:

```jsx
{
  comment.children.map((childId) => (
    <CommentNode
      key={childId}
      commentId={childId}
      commentsById={commentsById}
      addComment={addComment}
      depth={depth + 1}
    />
  ));
}
```

`CommentNode` renders itself for each child comment.

So if the structure is:

```txt
1
 └── 2
      └── 3
           └── 4
```

React renders:

```txt
CommentNode(1)
 └── CommentNode(2)
      └── CommentNode(3)
           └── CommentNode(4)
```

This is why it supports infinite nesting.

---

# 7. Important Interview Explanation

You can explain it like this:

> I designed the comment system using a normalised state structure instead of deeply nested arrays. Each comment is stored by ID, and each comment keeps an array of child comment IDs. Top-level comments are stored separately in `rootIds`. The UI uses a recursive `CommentNode` component to render replies at any depth. This keeps updates simple, improves lookup performance, and avoids complex deep object mutations.

---

# 8. Add Comment Flow

## Top-level comment

```js
addComment({
  text: "New comment",
  parentId: null,
});
```

Result:

```js
rootIds = ["1", "4", "new-id"];
```

## Reply comment

```js
addComment({
  text: "New reply",
  parentId: "1",
});
```

Result:

```js
commentsById["1"].children = ["2", "new-id"];
```

---

# 9. Time and Space Complexity

## Render

If there are `n` visible comments:

```txt
Time Complexity: O(n)
Space Complexity: O(d)
```

Where `d` is the depth of recursion.

## Add Comment

With normalised state:

```txt
Time Complexity: O(1)
```

Because we directly update:

```js
commentsById[parentId];
```

No need to search inside deeply nested arrays.

---

# 10. Production-Level Improvements

For a real product, add these:

## 1. Backend API

```txt
GET    /comments?parentId=null
GET    /comments?parentId=commentId
POST   /comments
PUT    /comments/:id
DELETE /comments/:id
```

## 2. Pagination for replies

Do not load all replies at once.

```txt
GET /comments?parentId=123&page=1&limit=10
```

## 3. Optimistic UI

Show reply immediately before API success.

```js
setCommentsById(...);
await api.createComment(...);
```

If API fails, rollback.

## 4. Security

Never render raw HTML from comments.

Avoid this:

```jsx
<div dangerouslySetInnerHTML={{ __html: comment.text }} />
```

Use plain text rendering:

```jsx
<p>{comment.text}</p>
```

## 5. Accessibility

Buttons should have proper text:

```jsx
<button aria-label="Reply to comment">Reply</button>
```

## 6. Deep nesting UI protection

Even if logic supports infinite nesting, UI should avoid unlimited indentation.

This code already does that:

```js
const dynamicMargin = Math.min(depth * 24, 120);
```

So after a certain depth, indentation stops increasing.

---

# 11. Common Interview Questions

## Q1. Why not store comments as nested arrays?

Because updating deeply nested comments becomes expensive and complex. Normalised state allows direct access by ID and cleaner immutable updates.

---

## Q2. How do you support infinite nesting?

Using a recursive component:

```jsx
<CommentNode />
```

Each comment renders its children using the same component.

---

## Q3. What happens if nesting becomes too deep?

Very deep recursion may affect rendering performance or call stack in extreme cases. In production, we can:

- Limit visual nesting
- Use pagination
- Collapse replies by default
- Use virtualisation
- Render very deep structures iteratively if required

---

## Q4. How do you delete a comment with replies?

Two options:

### Soft delete

Keep replies but mark parent as deleted:

```js
{
  text: "[deleted]",
  isDeleted: true
}
```

### Hard delete

Delete comment and all descendants recursively.

Soft delete is usually better for discussion systems.

---

## Q5. How do you optimise performance?

Use:

- Normalised state
- `React.memo`
- `useCallback`
- Pagination
- Lazy loading replies
- Virtualisation for huge comment lists

---

# 12. Optional Delete Function

You can add this later:

```jsx
function deleteComment(commentId) {
  setCommentsById((prev) => {
    const comment = prev[commentId];

    if (!comment) return prev;

    return {
      ...prev,
      [commentId]: {
        ...comment,
        text: "[deleted]",
        isDeleted: true,
      },
    };
  });
}
```

Then render:

```jsx
<p className="comment-text">{comment.isDeleted ? "[deleted]" : comment.text}</p>
```

---

# 13. Final Interview Summary

Use this answer in interviews:

> I would build the nested comment system using normalised state. Each comment has an ID, parent ID, and children IDs. Top-level comments are tracked separately using `rootIds`. The UI is rendered recursively using a `CommentNode` component, which receives a comment ID and renders its child comments by calling itself. This design supports infinite nesting, keeps updates efficient, and scales better than deeply nested arrays. For production, I would add pagination, lazy loading, optimistic updates, soft delete, sanitisation, accessibility, and virtualisation for large comment trees.

## 1. How to Add Delete Comment Functionality

In real applications there are two ways:

### Option 1: Soft Delete (Recommended)

Most platforms like Reddit, YouTube, StackOverflow use soft delete.

Instead of removing the comment:

```js
{
  id: "123",
  text: "Original comment",
  isDeleted: false
}
```

Update it to:

```js
{
  id: "123",
  text: "[deleted]",
  isDeleted: true
}
```

### Why Soft Delete?

Suppose:

```txt
Parent Comment
 ├── Reply A
 └── Reply B
```

If the parent comment is deleted:

```txt
[deleted]
 ├── Reply A
 └── Reply B
```

Replies remain visible.

This preserves discussion context.

---

### Soft Delete Implementation

#### Add delete button

```jsx
<button onClick={() => deleteComment(comment.id)}>Delete</button>
```

---

### Delete Function

```jsx
const deleteComment = useCallback((commentId) => {
  setCommentsById((prev) => ({
    ...prev,
    [commentId]: {
      ...prev[commentId],
      text: "[deleted]",
      isDeleted: true,
    },
  }));
}, []);
```

---

### Render Deleted Comment

```jsx
<p>{comment.isDeleted ? "[deleted]" : comment.text}</p>
```

---

## Option 2: Hard Delete

Completely remove node and descendants.

### Before

```txt
1
 ├── 2
 │    └── 3
 └── 4
```

Delete:

```txt
2
```

Result:

```txt
1
 └── 4
```

Comments:

```txt
2
3
```

are removed.

---

### Recursive Hard Delete

```js
function collectDescendants(id, commentsById) {
  const ids = [id];

  commentsById[id].children.forEach((childId) => {
    ids.push(...collectDescendants(childId, commentsById));
  });

  return ids;
}
```

---

### Delete Tree

```js
function deleteComment(commentId) {
  setCommentsById((prev) => {
    const idsToDelete = collectDescendants(commentId, prev);

    const updated = { ...prev };

    idsToDelete.forEach((id) => {
      delete updated[id];
    });

    return updated;
  });
}
```

---

### Interview Answer

> For discussion systems I prefer soft delete because deleting parent comments should not destroy valuable replies and conversation history.

---

# 2. Pagination for Replies

A production system should NEVER load all replies.

Bad:

```txt
Parent Comment
 └── 50,000 Replies
```

Rendering all replies:

```txt
Slow UI
Large payload
Huge memory usage
Poor UX
```

---

## Backend API Design

### Fetch replies

```http
GET /comments/1/replies?page=1&limit=10
```

Response:

```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "totalReplies": 157,
  "hasMore": true
}
```

---

## Local State

```jsx
const [replies, setReplies] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
```

---

## Load Replies

```jsx
async function loadReplies() {
  const response = await fetch(
    `/comments/${comment.id}/replies?page=${page}&limit=10`,
  );

  const data = await response.json();

  setReplies((prev) => [...prev, ...data.data]);

  setHasMore(data.hasMore);
  setPage((prev) => prev + 1);
}
```

---

## Show More Button

```jsx
{
  hasMore && <button onClick={loadReplies}>Load More Replies</button>;
}
```

---

### Result

```txt
Comment
 ├── Reply 1
 ├── Reply 2
 ├── Reply 3
 ├── Reply 4
 ├── Reply 5
 ├── Reply 6
 ├── Reply 7
 ├── Reply 8
 ├── Reply 9
 └── Reply 10

[Load More]
```

Click:

```txt
Reply 11
Reply 12
Reply 13
...
```

---

## Infinite Scroll Version

Using IntersectionObserver:

```jsx
const observer = useRef();

const lastReplyRef = useCallback(
  (node) => {
    if (!hasMore) return;

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadReplies();
      }
    });

    if (node) observer.current.observe(node);
  },
  [hasMore],
);
```

When last reply becomes visible:

```txt
Load next page automatically
```

---

# 3. Interview Discussion on Pagination

### Why Paginate?

Because:

```txt
Network Cost ↓
Memory Usage ↓
Render Time ↓
Initial Load ↓
```

---

### Complexity

Without pagination:

```txt
O(n)
```

With pagination:

```txt
O(pageSize)
```

Initial render becomes much faster.

---

# 4. Key Interview Points (Most Important)

### 1. Why Use Recursion?

Because reply depth is unknown.

```jsx
<CommentNode>
   <CommentNode>
      <CommentNode>
```

Supports infinite nesting.

---

### 2. Why Use Normalised State?

Bad:

```js
comments[].replies[].replies[]
```

Problems:

- Deep mutations
- Expensive updates
- Difficult deletes

Good:

```js
commentsById;
rootIds;
```

Benefits:

- O(1) lookup
- Easy updates
- Easy delete
- Scalable

---

### 3. How Do You Add Reply?

```js
parent.children.push(replyId);
```

No tree traversal required.

---

### 4. How Do You Delete?

**Soft Delete**

```js
{
  isDeleted: true;
}
```

Preferred.

**Hard Delete**

```js
Recursive descendant removal
```

---

### 5. How Do You Optimise Performance?

✅ React.memo

```jsx
export default memo(CommentNode);
```

✅ useCallback

```jsx
const addComment = useCallback(...)
```

✅ Reply Pagination

```txt
Load 10 at a time
```

✅ Lazy Loading

```txt
Load replies when expanded
```

✅ Virtualisation

```txt
react-window
react-virtualized
```

For thousands of comments.

---

### 6. What About Very Deep Trees?

Solutions:

```txt
1. Collapse replies
2. Pagination
3. Max visual indentation
4. Virtualisation
5. Lazy loading
```

Example:

```js
const margin = Math.min(depth * 24, 120);
```

---

### 7. Production Features

A senior-level answer should mention:

```txt
✔ Edit Comment
✔ Delete Comment
✔ Upvote / Downvote
✔ Mention Users (@user)
✔ Reply Pagination
✔ Optimistic UI
✔ Real-time Updates (WebSocket)
✔ Lazy Loading
✔ Accessibility
✔ Comment Search
✔ Sorting by New / Top
```

---

# 30-Second Interview Summary

> "I would build an Infinite Nested Comment System using a normalised data structure where each comment is stored by ID and keeps references to child comment IDs. Rendering is handled recursively through a CommentNode component, allowing unlimited nesting. For scalability, I'd implement React.memo, useCallback, lazy loading, reply pagination, and virtualisation. For deletion, I'd use soft delete to preserve discussion context. This design gives O(1) comment lookups, efficient updates, and production-level scalability."

# 1. Soft Delete Button Integration (Complete Example)

### Step 1: Add Delete Function in `App.jsx`

```jsx
const deleteComment = useCallback((commentId) => {
  setCommentsById((prev) => ({
    ...prev,
    [commentId]: {
      ...prev[commentId],
      text: "[deleted]",
      isDeleted: true,
    },
  }));
}, []);
```

---

### Step 2: Pass Delete Function

```jsx
<CommentNode
  commentId={commentId}
  commentsById={commentsById}
  addComment={addComment}
  deleteComment={deleteComment}
  depth={0}
/>
```

---

### Step 3: Receive in Component

```jsx
function CommentNode({
  commentId,
  commentsById,
  addComment,
  deleteComment,
  depth
}) {
```

---

### Step 4: Add Delete Button

```jsx
<div className="comment-actions">
  <button onClick={() => setShowReplyForm((prev) => !prev)}>Reply</button>

  <button onClick={() => deleteComment(comment.id)}>Delete</button>
</div>
```

---

### Step 5: Render Deleted State

```jsx
<p className="comment-text">{comment.isDeleted ? "[deleted]" : comment.text}</p>
```

---

### Better UI

```jsx
{
  comment.isDeleted ? (
    <p className="deleted-comment">This comment has been deleted</p>
  ) : (
    <p>{comment.text}</p>
  );
}
```

CSS:

```css
.deleted-comment {
  color: gray;
  font-style: italic;
}
```

---

### Behaviour

Before:

```txt
React is awesome
 └── I agree
```

After deleting parent:

```txt
[deleted]
 └── I agree
```

Replies are preserved.

This is the preferred production approach.

---

# 2. Lazy Loading Replies

## Problem

Suppose a comment has:

```txt
50,000 replies
```

Loading everything initially is expensive.

Bad:

```txt
Large API payload
Large DOM
Slow rendering
Poor user experience
```

---

## Better Architecture

Load replies only when user expands them.

---

### Initial State

```jsx
const [replies, setReplies] = useState([]);
const [isLoaded, setIsLoaded] = useState(false);
const [showReplies, setShowReplies] = useState(false);
```

---

### API Function

```jsx
async function fetchReplies(commentId) {
  const response = await fetch(`/api/comments/${commentId}/replies`);

  return response.json();
}
```

---

### Expand Replies

```jsx
async function handleToggleReplies() {
  if (!isLoaded) {
    const result = await fetchReplies(comment.id);

    setReplies(result);
    setIsLoaded(true);
  }

  setShowReplies((prev) => !prev);
}
```

---

### Button

```jsx
<button onClick={handleToggleReplies}>
  {showReplies ? "Hide Replies" : "Show Replies"}
</button>
```

---

### Render Replies

```jsx
{
  showReplies &&
    replies.map((reply) => <CommentNode key={reply.id} commentId={reply.id} />);
}
```

---

# Lazy Loading Flow

```txt
Page Loaded
     │
     ▼
Comment Rendered
     │
     ▼
Replies NOT Loaded
     │
     ▼
User Clicks "Show Replies"
     │
     ▼
Fetch Replies API
     │
     ▼
Cache Replies
     │
     ▼
Render Replies
```

---

# Advanced Lazy Loading + Pagination

### Load First 10

```http
GET /comments/1/replies?page=1&limit=10
```

Response:

```json
{
  "data": [...],
  "hasMore": true
}
```

---

### State

```jsx
const [page, setPage] = useState(1);
const [replies, setReplies] = useState([]);
const [hasMore, setHasMore] = useState(true);
```

---

### Load More Replies

```jsx
async function loadMoreReplies() {
  const response = await fetch(`/comments/${comment.id}/replies?page=${page}`);

  const result = await response.json();

  setReplies((prev) => [...prev, ...result.data]);

  setHasMore(result.hasMore);

  setPage((prev) => prev + 1);
}
```

---

### UI

```jsx
{
  hasMore && <button onClick={loadMoreReplies}>Load More Replies</button>;
}
```

---

# 3. Lazy Loading with React Query (Production)

```jsx
const { data, isLoading } = useQuery({
  queryKey: ["replies", commentId],
  queryFn: () => fetchReplies(commentId),
  enabled: showReplies,
});
```

Benefit:

✅ cache

✅ retry

✅ deduplication

✅ background refresh

---

# 4. Key Performance Optimisations

These are the points interviewers expect.

---

## Optimisation 1: Normalised State

Instead of:

```js
[
  {
    replies: [
      {
        replies: [],
      },
    ],
  },
];
```

Use:

```js
{
  commentsById:{},
  rootIds:[]
}
```

Benefits:

```txt
O(1) lookup
Easy updates
Easy deletes
```

---

## Optimisation 2: React.memo

Prevent unnecessary renders.

```jsx
export default React.memo(CommentNode);
```

Without:

```txt
Add one reply
↓
Entire tree rerenders
```

With:

```txt
Only affected node rerenders
```

---

## Optimisation 3: useCallback

```jsx
const addComment = useCallback(() => {}, []);
```

Avoids:

```txt
New function creation
Unnecessary child rerenders
```

---

## Optimisation 4: Lazy Load Replies

Instead of:

```txt
Load 50,000 replies
```

Use:

```txt
Load when expanded
```

Reduces:

```txt
Network traffic
DOM size
Memory
```

---

## Optimisation 5: Pagination

Load:

```txt
10 replies
```

instead of:

```txt
10,000 replies
```

Benefits:

```txt
Fast initial page
Lower API cost
Better UX
```

---

## Optimisation 6: Virtualisation

If thousands of comments are visible:

```bash
react-window
react-virtualized
```

Only visible items are rendered.

```txt
10000 comments
↓
20 visible DOM nodes
```

Huge performance gain.

---

## Optimisation 7: Collapse Replies by Default

Instead of:

```txt
Render entire tree
```

Use:

```txt
Comment
[Show Replies]
```

Rendering cost drops dramatically.

---

## Optimisation 8: Optimistic UI

Immediately show reply:

```jsx
setComments(...);
```

Before:

```txt
Wait API
```

After:

```txt
Instant UI update
```

Great user experience.

---

## Optimisation 9: Memoised Derived Data

```jsx
const sortedReplies = useMemo(() => sortReplies(replies), [replies]);
```

Avoid expensive sorting on every render.

---

## Optimisation 10: Maximum Indentation

Prevent layout issues.

```jsx
const margin = Math.min(depth * 20, 120);
```

Without:

```txt
Infinite nesting
→ Horizontal scrolling
```

---

# Senior-Level Interview Summary

> "To make an infinite nested comment system production-ready, I would use a normalised state structure, recursive rendering, React.memo, useCallback, lazy loading, pagination, optimistic UI updates, and virtualisation. For deletion, I would implement soft delete so replies remain visible. Replies should be fetched only when expanded and paginated in batches to prevent large DOM trees and excessive API payloads. This approach scales efficiently from a few comments to tens of thousands while maintaining excellent user experience and render performance."
