If you're asking about **"Load More Content + Truncate Text"** (very common React interview question), here's a complete example.

***

# Scenario

Show only first 100 characters.

```text
Lorem ipsum dolor sit amet...
```

User clicks:

```text
Load More
```

Show full content.

***

# React Example

```jsx
import { useState } from "react";

export default function App() {
  const [expanded, setExpanded] =
    useState(false);

  const content =
    `React is a JavaScript library for building user interfaces.
     It allows developers to create reusable components and
     efficiently update the DOM using a virtual DOM.`;

  const truncatedText =
    content.slice(0, 100);

  return (
    <div>
      <p>
        {expanded
          ? content
          : `${truncatedText}...`}
      </p>

      <button
        onClick={() =>
          setExpanded(
            !expanded
          )
        }
      >
        {expanded
          ? "Show Less"
          : "Load More"}
      </button>
    </div>
  );
}
```

***

# Multiple Cards Example

```jsx
import { useState } from "react";

function Post({ text }) {
  const [expanded,
         setExpanded] =
    useState(false);

  return (
    <div>
      <p>
        {expanded
          ? text
          : text.slice(0, 50)}
      </p>

      <button
        onClick={() =>
          setExpanded(
            !expanded
          )
        }
      >
        {expanded
          ? "Less"
          : "More"}
      </button>
    </div>
  );
}
```

***

# CSS Truncate (Single Line)

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```jsx
<p className="truncate">
  Very long content...
</p>
```

Output:

```text
Very long conten...
```

***

# CSS Multi-Line Truncate

```css
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

```jsx
<p className="truncate-3">
  Long article content...
</p>
```

Shows only:

```text
3 lines...
```

***

# Load More List Example

Frequently asked in React interviews.

```jsx
import React,
{
  useState
} from "react";

const data = [
  "React",
  "Angular",
  "Vue",
  "Next",
  "Node",
  "TypeScript",
  "Redux",
  "GraphQL"
];

export default function App() {

  const [visible,
         setVisible] =
    useState(3);

  return (
    <>
      {data
        .slice(0, visible)
        .map(item => (
          <p key={item}>
            {item}
          </p>
        ))}

      {visible <
        data.length && (
        <button
          onClick={() =>
            setVisible(
              prev =>
                prev + 3
            )
          }
        >
          Load More
        </button>
      )}
    </>
  );
}
```

***

# Senior React Interview Answer

When implementing **Load More + Truncate**:

✅ Store expansion state using `useState`

✅ Use `slice()` for truncation

✅ Use CSS `text-overflow: ellipsis` for single-line content

✅ Use `-webkit-line-clamp` for multi-line truncation

✅ For large datasets, combine with:

* Lazy Loading
* Infinite Scroll
* Pagination
* Generators/Iterators

These patterns are commonly used in feeds, blogs, comments, dashboards, and social media applications.


# Multi-Line CSS Truncate Example

Single-line truncation uses:

```css
text-overflow: ellipsis;
```

For **multi-line content**, use `line-clamp`.

***

## 3-Line Truncate

```css
.description {
  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

***

## React Example

```jsx
export default function Card() {
  const content = `
    React is a JavaScript library for building
    user interfaces. It allows developers to
    create reusable components and efficiently
    update the DOM using a virtual DOM.
    React is widely used in enterprise
    applications because of its component-driven
    architecture.
  `;

  return (
    <div className="card">
      <p className="description">
        {content}
      </p>
    </div>
  );
}
```

Result:

```text
React is a JavaScript library
for building user interfaces...
```

Only 3 lines are shown.

***

# Expand / Collapse (Read More)

```jsx
import { useState } from "react";

export default function Post() {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <>
      <p
        className={
          expanded
            ? ""
            : "truncate-3"
        }
      >
        Long article content...
      </p>

      <button
        onClick={() =>
          setExpanded(
            prev => !prev
          )
        }
      >
        {expanded
          ? "Show Less"
          : "Read More"}
      </button>
    </>
  );
}
```

```css
.truncate-3 {
  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;
}
```

***

# Performance Tips for Large Lists

When rendering:

```javascript
1000+
5000+
10000+
```

records in React, performance can degrade significantly.

***

# 1. Use Pagination

❌ Bad

```jsx
users.map(user => (
  <UserCard {...user} />
));
```

Rendering:

```text
10,000 Components
```

***

✅ Better

```jsx
users
  .slice(
    currentPage * 20,
    currentPage * 20 + 20
  )
  .map(user => (
    <UserCard {...user} />
  ));
```

Render only 20 rows.

***

# 2. Load More Pattern

```jsx
const [visibleItems,
       setVisibleItems] =
  useState(20);

users
  .slice(0, visibleItems)
  .map(...);
```

Button:

```jsx
<button
  onClick={() =>
    setVisibleItems(
      prev => prev + 20
    )
  }
>
  Load More
</button>
```

***

# 3. Virtualisation (Most Important)

For enterprise React applications, use:

```text
react-window
react-virtualized
TanStack Virtual
```

Example:

```jsx
import {
  FixedSizeList
} from "react-window";

<FixedSizeList
  height={500}
  width={400}
  itemSize={35}
  itemCount={10000}
>
  {Row}
</FixedSizeList>
```

Only visible rows are rendered.

```text
10000 Records
↓
Only 10-15 DOM nodes
```

Huge performance gain.

***

# 4. Memoise Expensive Rows

```jsx
const UserRow = React.memo(
  ({ user }) => {
    return (
      <div>
        {user.name}
      </div>
    );
  }
);
```

Prevents unnecessary rerenders.

***

# 5. Stable Keys

❌ Bad

```jsx
users.map(
  (user, index) => (
    <Row key={index} />
  )
);
```

***

✅ Good

```jsx
users.map(user => (
  <Row
    key={user.id}
  />
));
```

***

# 6. Use `useMemo`

```jsx
const filteredUsers =
  useMemo(
    () =>
      users.filter(user =>
        user.name
          .toLowerCase()
          .includes(search)
      ),
    [users, search]
  );
```

Avoids filtering on every render.

***

# 7. Debounce Search

❌

```jsx
onChange={() =>
  filterUsers()
}
```

Runs on every keystroke.

***

✅

```jsx
const debouncedSearch =
  useDebounce(
    search,
    300
  );
```

Only filter after typing stops.

***

# 8. Avoid Inline Functions in Huge Lists

❌

```jsx
users.map(user => (
  <button
    onClick={() =>
      deleteUser(user.id)
    }
  />
));
```

Creates thousands of functions.

***

✅

```jsx
const handleDelete =
  useCallback(
    id => {
      deleteUser(id);
    },
    []
  );
```

***

# 9. Infinite Scroll

Instead of:

```text
Load entire dataset
```

Use:

```text
Load 20
↓
Scroll
↓
Load 20 More
```

Common in:

```text
LinkedIn
Facebook
Twitter
Instagram
```

***

# 10. Generator + Lazy Loading

```javascript
function* employeeGenerator(
  employees
) {
  for (const emp of employees) {
    yield emp;
  }
}
```

Load only what is required.

```text
Next()
↓
Next()
↓
Next()
```

Memory efficient.

***

# Senior React Interview Answer

For large lists:

✅ Pagination

✅ Load More

✅ Infinite Scroll

✅ Virtualisation (`react-window`)

✅ `React.memo`

✅ `useMemo`

✅ `useCallback`

✅ Stable Keys

✅ Debounced Search

✅ Generator-Based Lazy Loading

The **best optimisation for 10,000+ rows is virtualisation**, because React only renders visible rows instead of the entire dataset, dramatically reducing memory usage and DOM updates.


If you mean **"how Medium.com locks content and shows only a truncated preview"**, that's a very common React/frontend interview scenario.

## Important Reality

❌ **Do NOT send the full premium content to the browser and just hide it with CSS.**

Bad approach:

```jsx
<p className="truncate">
  {fullArticle}
</p>
```

Users can easily view source, inspect state, or check network responses.

***

# ✅ Correct Approach (Server Side Lock)

## API Response for Free User

Backend returns:

```json
{
  "title": "React Design Patterns",
  "preview": "Builder pattern helps create complex objects...",
  "isPremium": true,
  "isLocked": true
}
```

React:

```jsx
function Article({ article }) {
  return (
    <>
      <h1>{article.title}</h1>

      <p>{article.preview}</p>

      {article.isLocked && (
        <Paywall />
      )}
    </>
  );
}
```

Output:

```text
Builder pattern helps create...
--------------------------------
🔒 Subscribe to continue reading
```

Only preview is sent.

***

# Medium-Style Paywall

## React Component

```jsx
function Article({
  content,
  locked
}) {
  return (
    <div>

      <div
        className={
          locked
            ? "blurred"
            : ""
        }
      >
        {content}
      </div>

      {locked && (
        <div className="paywall">
          <h3>
            Member-only story
          </h3>

          <button>
            Subscribe
          </button>
        </div>
      )}

    </div>
  );
}
```

CSS:

```css
.blurred {
  max-height: 300px;

  overflow: hidden;

  position: relative;
}

.blurred::after {
  content: "";

  position: absolute;

  bottom: 0;

  width: 100%;
  height: 100px;

  background:
    linear-gradient(
      transparent,
      white
    );
}
```

***

# Medium-Style API Design

### Guest User

```json
{
  "title": "React Patterns",
  "preview": "Builder Pattern...",
  "locked": true
}
```

### Paid User

```json
{
  "title": "React Patterns",
  "content": "Full article...",
  "locked": false
}
```

***

# Load More Pattern

For public content:

```jsx
const [showFull,
       setShowFull] =
  useState(false);

<p>
  {showFull
    ? article
    : article.slice(
        0,
        300
      )}
</p>

<button
  onClick={() =>
    setShowFull(true)
  }
>
  Read More
</button>
```

***

# Enterprise Interview Question

### Q: How would you protect premium content?

Bad:

```text
Send full content
Hide with CSS
```

Anyone can inspect the response.

***

Good:

```text
Backend sends preview only
Backend validates subscription
Backend sends full article only to authorised users
```

Architecture:

```text
React UI
   ↓
API Gateway
   ↓
Auth Check
   ↓
Premium User ?
   ↓
YES → Full Content

NO → Preview Content
```

***

# Senior Frontend Interview Answer

> Content locking should always be enforced on the server. The frontend may visually truncate or blur content for user experience, but the complete premium content must never be sent to unauthorised users. A secure implementation returns only preview content for guests and full content for authenticated subscribers. CSS truncation (`line-clamp`, gradients, blur overlays) should be considered presentation enhancements, not security mechanisms.
