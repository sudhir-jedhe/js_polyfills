# React Mentions Component (Production-Ready)

A **Mentions Component** is a common frontend machine-coding and system design interview question.

Examples:

```text
LinkedIn  → @John
Slack     → @sudhir
Teams     → @Apoorva
GitHub    → @octocat
```

Requirements:

```text
✅ Type @
✅ Show suggestions
✅ Keyboard navigation
✅ Select mention
✅ Highlight mentions
✅ Async search
✅ Debounce API calls
✅ Accessibility
✅ Large dataset support
```

***

# Folder Structure

```text
src/
│
├── App.jsx
├── MentionsInput.jsx
├── MentionDropdown.jsx
├── useDebounce.js
└── styles.css
```

***

# Mock Data

```jsx
// users.js

export const users = [
  {
    id: 1,
    name: "Sudhir Jedhe"
  },
  {
    id: 2,
    name: "Apoorva Verma"
  },
  {
    id: 3,
    name: "John Luckachan"
  },
  {
    id: 4,
    name: "Pawan Kumar"
  },
  {
    id: 5,
    name: "Mahendra Aanjna"
  }
];
```

***

# useDebounce.js

```jsx
import {
  useEffect,
  useState
} from "react";

export default function useDebounce(
  value,
  delay = 300
) {
  const [
    debounced,
    setDebounced
  ] = useState(value);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setDebounced(value);
      }, delay);

    return () =>
      clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

***

# MentionDropdown.jsx

```jsx
function MentionDropdown({
  suggestions,
  focusedIndex,
  onSelect
}) {
  if (
    suggestions.length === 0
  ) {
    return null;
  }

  return (
    <ul className="dropdown">
      {suggestions.map(
        (
          user,
          index
        ) => (
          <li
            key={user.id}
            className={
              focusedIndex ===
              index
                ? "active"
                : ""
            }
            onMouseDown={() =>
              onSelect(
                user
              )
            }
          >
            {user.name}
          </li>
        )
      )}
    </ul>
  );
}

export default MentionDropdown;
```

***

# MentionsInput.jsx

```jsx
import {
  useMemo,
  useState
} from "react";

import useDebounce
  from "./useDebounce";

import MentionDropdown
  from "./MentionDropdown";

import { users }
  from "./users";

export default function MentionsInput() {

  const [
    value,
    setValue
  ] = useState("");

  const [
    mentionTerm,
    setMentionTerm
  ] = useState("");

  const [
    dropdownVisible,
    setDropdownVisible
  ] = useState(false);

  const [
    focusedIndex,
    setFocusedIndex
  ] = useState(0);

  const debouncedTerm =
    useDebounce(
      mentionTerm
    );

  const suggestions =
    useMemo(() => {
      if (
        !debouncedTerm
      )
        return [];

      return users.filter(
        user =>
          user.name
            .toLowerCase()
            .includes(
              debouncedTerm.toLowerCase()
            )
      );
    }, [
      debouncedTerm
    ]);

  const handleChange =
    e => {
      const text =
        e.target.value;

      setValue(text);

      const lastWord =
        text.split(" ")
          .pop();

      if (
        lastWord.startsWith(
          "@"
        )
      ) {
        setMentionTerm(
          lastWord.slice(
            1
          )
        );

        setDropdownVisible(
          true
        );
      } else {
        setDropdownVisible(
          false
        );
      }
    };

  const insertMention =
    user => {
      const words =
        value.split(" ");

      words.pop();

      words.push(
        `@${user.name}`
      );

      setValue(
        words.join(" ") +
          " "
      );

      setDropdownVisible(
        false
      );
    };

  const onKeyDown =
    e => {
      if (
        !dropdownVisible
      )
        return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();

          setFocusedIndex(
            prev =>
              Math.min(
                prev + 1,
                suggestions.length -
                  1
              )
          );
          break;

        case "ArrowUp":
          e.preventDefault();

          setFocusedIndex(
            prev =>
              Math.max(
                prev - 1,
                0
              )
          );
          break;

        case "Enter":
          e.preventDefault();

          insertMention(
            suggestions[
              focusedIndex
            ]
          );
          break;

        default:
          break;
      }
    };

  return (
    <div className="mentions-container">
      <textarea
        rows={6}
        value={value}
        onChange={
          handleChange
        }
        onKeyDown={
          onKeyDown
        }
        placeholder="Type @ to mention someone"
        aria-label="Mentions Input"
      />

      {dropdownVisible && (
        <MentionDropdown
          suggestions={
            suggestions
          }
          focusedIndex={
            focusedIndex
          }
          onSelect={
            insertMention
          }
        />
      )}
    </div>
  );
}
```

***

# App.jsx

```jsx
import MentionsInput
  from "./MentionsInput";

export default function App() {
  return (
    <div>
      <h1>
        Mentions Component
      </h1>

      <MentionsInput />
    </div>
  );
}
```

***

# styles.css

```css
.mentions-container {
  width: 500px;
  margin: 30px auto;
  position: relative;
}

textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow: auto;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover,
.dropdown li.active {
  background: #f4f4f4;
}
```

***

# Senior-Level Follow-Up Discussion

### How would you support 100k users?

Don't load all users:

```jsx
GET /users?q=apo
```

Use:

```text
Debounce
Pagination
Virtualisation
Caching
```

***

### How would you highlight mentions?

Store:

```js
[
 {
   id: 1,
   label: "Sudhir Jedhe"
 }
]
```

Instead of plain text.

***

### Mention Data Model

```js
{
  text:
   "Hello @Sudhir Jedhe",

  mentions: [
    {
      id: "1",
      user: "Sudhir Jedhe",
      start: 6,
      end: 19
    }
  ]
}
```

***

### Enterprise Features

```text
✅ Async Search

✅ Infinite Scroll

✅ Multi Mention Types
   @user
   #channel
   $ticket

✅ Highlight Rendering

✅ Keyboard Navigation

✅ Accessibility

✅ Mobile Support

✅ Virtualization

✅ GraphQL Search
```

### Interview Answer

> I would separate the mentions engine from the UI, maintain structured mention metadata rather than storing plain text only, use debounced async search for large datasets, support keyboard navigation and accessibility, and virtualise suggestion lists when dealing with thousands of results. This keeps the component scalable, reusable, and suitable for enterprise applications.
