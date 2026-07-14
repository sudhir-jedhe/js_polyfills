# Reusable Searchable Select Dropdown in React

### Interview-Ready Component (Single Select)

### Features

✅ Reusable

✅ Search Support

✅ Keyboard Navigation

✅ Outside Click Handling

✅ Accessible (ARIA)

✅ Controlled Component

✅ Custom Placeholder

✅ Custom Rendering

✅ Easy to Convert to Multi-Select

Searchable dropdowns commonly include search filtering, keyboard navigation, click-outside handling, and accessibility support. Modern implementations often follow the ARIA combobox pattern and support efficient filtering. [\[bing.com\]](https://bing.com/search?q=React+reusable+searchable+select+dropdown+component+example), [\[github.com\]](https://github.com/luciodale/react-searchable-dropdown)

---

# Folder Structure

```txt
src/
│
├── App.jsx
│
├── components/
│    └── SelectDropdown.jsx
│
└── styles.css
```

---

# Usage Example

```jsx
const cities = [
  {
    label: "Pune",
    value: "pune",
  },
  {
    label: "Mumbai",
    value: "mumbai",
  },
  {
    label: "Bangalore",
    value: "bangalore",
  },
  {
    label: "Hyderabad",
    value: "hyderabad",
  },
];
```

---

# App.jsx

```jsx
import { useState } from "react";
import SelectDropdown from "./components/SelectDropdown";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    {
      label: "Pune",
      value: "pune",
    },
    {
      label: "Mumbai",
      value: "mumbai",
    },
    {
      label: "Bangalore",
      value: "bangalore",
    },
    {
      label: "Hyderabad",
      value: "hyderabad",
    },
  ];

  return (
    <div className="container">
      <h2>Searchable Dropdown</h2>

      <SelectDropdown
        options={cities}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Select City"
      />

      <pre>{JSON.stringify(selectedCity, null, 2)}</pre>
    </div>
  );
}
```

---

# SelectDropdown.jsx

```jsx
import { useState, useMemo, useRef, useEffect } from "react";

export default function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef(null);

  // Outside click

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  function handleSelect(option) {
    onChange(option);

    setSearch("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1),
        );

        break;

      case "ArrowUp":
        event.preventDefault();

        setHighlightedIndex((prev) => Math.max(prev - 1, 0));

        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
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
    <div ref={dropdownRef} className="dropdown">
      <div
        className="dropdown-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value?.label || placeholder}
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
          />

          <ul className="dropdown-list" role="listbox">
            {filteredOptions.length === 0 ? (
              <li>No results</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={highlightedIndex === index ? "active" : ""}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

# CSS

```css
.container {
  width: 400px;
  margin: 40px auto;
}

.dropdown {
  position: relative;
}

.dropdown-header {
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  background: white;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
}

.dropdown-menu input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #eee;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;

  max-height: 250px;
  overflow-y: auto;
}

.dropdown-list li {
  padding: 10px;
  cursor: pointer;
}

.dropdown-list li:hover,
.active {
  background: #2563eb;
  color: white;
}
```

---

# How It Works

### Step 1

User clicks dropdown.

```txt
Closed
  ↓
Open
```

---

### Step 2

User types:

```txt
pu
```

Filter:

```js
options.filter(...)
```

Result:

```txt
Pune
```

---

### Step 3

Use:

```txt
Arrow Down
Arrow Up
```

to navigate.

---

### Step 4

Press:

```txt
Enter
```

Selected value:

```js
{
  label: "Pune",
  value: "pune"
}
```

---

# Reusability Improvements (Senior-Level)

Make component generic:

```jsx
<SelectDropdown
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getLabel={(user) => user.name}
  getValue={(user) => user.id}
/>
```

Example:

```js
[
  {
    id: 1,
    name: "Sudhir",
  },
  {
    id: 2,
    name: "Apoorva",
  },
];
```

This allows the same component to work for:

```txt
Cities
Users
Countries
Projects
Products
```

---

# Interview Follow-Up: Handling 10,000 Options

For very large lists:

```txt
10,000+
50,000+
```

Use virtualization:

```bash
npm install react-window
```

Render only visible items.

```jsx
<FixedSizeList>
```

instead of:

```jsx
filteredOptions.map(...)
```

This keeps scrolling smooth and significantly reduces DOM nodes. Virtualized searchable dropdowns are a common optimisation strategy for large datasets. [\[reactscript.com\]](https://reactscript.com/advanced-dropdown-searchable/), [\[github.com\]](https://github.com/luciodale/react-searchable-dropdown)

---

# Senior React Interview Answer

> I would build the dropdown as a controlled, reusable component that accepts options, value, and onChange props. Internally it manages open/close state, search text, keyboard navigation, and outside-click handling. Search is performed by filtering the options array, while ARIA roles such as `combobox`, `listbox`, and `option` improve accessibility. For large datasets, I would add debounced search, server-side filtering, and virtualization using `react-window` to maintain performance.

Great follow-up. For a **Senior React interview**, these three topics are exactly what interviewers ask after a basic dropdown implementation.

---

# 1. Handle Large Option Lists with Virtualization

## Problem

Suppose your dropdown has:

```txt
10,000 users
50,000 products
100,000 cities
```

Current implementation:

```jsx
filteredOptions.map((option) => <li>{option.label}</li>);
```

Produces:

```txt
10,000+ DOM Nodes
```

Problems:

```txt
❌ Slow render
❌ High memory usage
❌ Poor scrolling performance
❌ Input lag
```

---

## Solution: Virtualization

Render only visible rows.

Instead of:

```txt
10,000 DOM Nodes
```

Render:

```txt
20-50 DOM Nodes
```

depending on viewport size.

---

## Install

```bash
npm install react-window
```

---

## Replace List

```jsx
import { FixedSizeList } from "react-window";
```

---

## Row Renderer

```jsx
function Row({ index, style, data }) {
  const { options, onSelect, highlightedIndex } = data;

  const option = options[index];

  return (
    <div
      style={style}
      className={highlightedIndex === index ? "active-row" : "row"}
      onClick={() => onSelect(option)}
    >
      {option.label}
    </div>
  );
}
```

---

## Virtualized Dropdown

```jsx
<FixedSizeList
  height={250}
  width="100%"
  itemCount={filteredOptions.length}
  itemSize={40}
  itemData={{
    options: filteredOptions,
    onSelect: handleSelect,
    highlightedIndex,
  }}
>
  {Row}
</FixedSizeList>
```

---

## Rendering Comparison

Without virtualization:

```txt
10000 options
↓
10000 DOM Nodes
```

With virtualization:

```txt
10000 options
↓
~30 DOM Nodes
```

---

## Interview Answer

> Virtualization improves dropdown performance by rendering only visible options. Libraries such as `react-window` or `react-virtualized` reduce DOM nodes dramatically, making it possible to handle tens of thousands of options without lag.

---

# 2. Custom Option Rendering

A reusable component should allow:

```txt
Users
Products
Countries
Projects
```

to render differently.

---

## Current

```jsx
<option.label>
```

Not flexible.

---

## Add renderOption Prop

```jsx
<SelectDropdown
  options={users}
  renderOption={(user) => (
    <div>
      <img src={user.avatar} alt={user.name} width={30} />

      <span>{user.name}</span>
    </div>
  )}
/>
```

---

## Component Update

```jsx
export default function SelectDropdown({
  options,
  renderOption,
  ...
}) {
```

---

## Rendering

Replace:

```jsx
<li>{option.label}</li>
```

with:

```jsx
<li>{renderOption ? renderOption(option) : option.label}</li>
```

---

## User Example

```js
const users = [
  {
    id: 1,
    name: "Sudhir",
    avatar: "/sudhir.png",
  },
];
```

---

## Render

```jsx
<SelectDropdown
  options={users}
  renderOption={(user) => (
    <>
      <img src={user.avatar} alt="" />

      {user.name}
    </>
  )}
/>
```

---

# 3. Add Multi-Select Support

Most enterprise systems require:

```txt
Assign Users
Select Tags
Choose Skills
Pick Countries
```

---

## State

Single Select:

```jsx
const [value, setValue];
```

---

Multi Select:

```jsx
const [selectedValues, setSelectedValues] = useState([]);
```

---

## Select Logic

```jsx
function toggleOption(option) {
  const exists = selectedValues.some((item) => item.value === option.value);

  if (exists) {
    setSelectedValues((prev) =>
      prev.filter((item) => item.value !== option.value),
    );
  } else {
    setSelectedValues((prev) => [...prev, option]);
  }
}
```

---

## Checkbox Version

```jsx
<li onClick={() => toggleOption(option)}>
  <input
    type="checkbox"
    checked={selectedValues.some((item) => item.value === option.value)}
    readOnly
  />

  {option.label}
</li>
```

---

## Selected Chips

```jsx
<div className="chips">
  {selectedValues.map((option) => (
    <span key={option.value} className="chip">
      {option.label}

      <button onClick={() => toggleOption(option)}>×</button>
    </span>
  ))}
</div>
```

---

## Example

Selected:

```txt
✓ React
✓ TypeScript
✓ Node.js
```

UI:

```txt
[React ×]
[TypeScript ×]
[Node.js ×]
```

---

# Generic Reusable API

```jsx
<SelectDropdown
  options={skills}
  isMulti={true}
  value={selectedSkills}
  onChange={setSelectedSkills}
  renderOption={renderSkill}
  searchable={true}
  virtualized={true}
/>
```

---

# Production-Level Props

```ts
interface SelectDropdownProps<T> {
  options: T[];

  value: T | T[];

  onChange: (value: T | T[]) => void;

  isMulti?: boolean;

  searchable?: boolean;

  placeholder?: string;

  renderOption?: (option: T) => ReactNode;

  getLabel?: (option: T) => string;

  getValue?: (option: T) => string;

  virtualized?: boolean;

  loading?: boolean;

  disabled?: boolean;
}
```

---

# Senior React Interview Answer

> For large datasets, I use virtualization with `react-window` so that only visible options are rendered, reducing DOM nodes from thousands to a few dozen. To improve reusability, I expose a `renderOption` prop that allows consumers to customise how options appear, such as adding avatars, icons, or metadata. For enterprise use cases, I add multi-select support using selected chips and checkbox-style option selection. Combined with keyboard navigation, search, ARIA accessibility, outside-click handling, and debounced filtering, this results in a production-ready dropdown component suitable for large-scale applications.

Perfect Senior React interview follow-up. Let's evolve the component into an **enterprise-grade Searchable Multi-Select Dropdown**.

---

# Final Architecture

```txt
SelectDropdown
│
├── Search Input
│
├── Server Search
│    └── Debounced API
│
├── Virtualized List
│    └── react-window
│
├── Keyboard Navigation
│
├── Multi Select
│    └── Chips
│
├── Custom Render Option
│
└── Accessibility (ARIA)
```

---

# 1. Server-Side Search + Virtualization

## Why?

Current implementation:

```js
const filteredOptions =
  options.filter(...)
```

Works for:

```txt
100 options
500 options
```

Fails for:

```txt
100,000 users
1,000,000 products
```

Never fetch all records.

---

## Backend API

```http
GET /users?search=sud&page=1&pageSize=20
```

Response:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Sudhir Jedhe"
    }
  ],
  "hasMore": true
}
```

---

## Debounced Search

```jsx
const debouncedSearch = useDebounce(search, 500);
```

---

## API Call

```jsx
useEffect(() => {
  async function fetchUsers() {
    setLoading(true);

    const response = await fetch(`/api/users?search=${debouncedSearch}`);

    const data = await response.json();

    setOptions(data.items);

    setLoading(false);
  }

  if (debouncedSearch) {
    fetchUsers();
  }
}, [debouncedSearch]);
```

---

## Flow

```txt
User Types
      │
      ▼
Debounce 500ms
      │
      ▼
Server Request
      │
      ▼
20 Records Returned
      │
      ▼
Virtualized List
```

---

# Why Server Search + Virtualization?

Without:

```txt
100,000 options
↓
Browser downloads everything
```

Bad.

---

With:

```txt
Server Search
↓
Only 20 results
↓
Virtualized
↓
Only visible rows render
```

Best practice.

---

# 2. Virtualization

Install:

```bash
npm install react-window
```

---

## Row Renderer

```jsx
function Row({ index, style, data }) {
  const option = data.options[index];

  return (
    <div
      style={style}
      className="row"
      onClick={() => data.toggleOption(option)}
    >
      {data.renderOption ? data.renderOption(option) : option.label}
    </div>
  );
}
```

---

## Virtualized Dropdown

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={300}
  itemCount={options.length}
  itemSize={40}
  width="100%"
  itemData={{
    options,
    toggleOption,
    renderOption,
  }}
>
  {Row}
</FixedSizeList>;
```

---

# Result

Without virtualization:

```txt
5000 DOM Nodes
```

With virtualization:

```txt
~30 DOM Nodes
```

---

# 3. Multi-Select Support

---

## State

Instead of:

```jsx
const [value, setValue];
```

Use:

```jsx
const [selectedOptions, setSelectedOptions] = useState([]);
```

---

## Toggle Logic

```jsx
function toggleOption(option) {
  const exists = selectedOptions.some((item) => item.value === option.value);

  if (exists) {
    setSelectedOptions((prev) =>
      prev.filter((item) => item.value !== option.value),
    );
  } else {
    setSelectedOptions((prev) => [...prev, option]);
  }
}
```

---

## Checkbox UI

```jsx
<li>
  <input
    type="checkbox"
    checked={selectedOptions.some((x) => x.value === option.value)}
    readOnly
  />

  {option.label}
</li>
```

---

# Chips UI

Selected:

```txt
React
TypeScript
Node
```

Render:

```jsx
<div className="chips">
  {selectedOptions.map((option) => (
    <div className="chip" key={option.value}>
      {option.label}

      <button onClick={() => toggleOption(option)}>×</button>
    </div>
  ))}
</div>
```

UI:

```txt
[React ×]
[Node ×]
[TypeScript ×]
```

---

# 4. Keyboard Navigation for Multi-Select

Interview favourite.

---

## Behaviour

```txt
ArrowDown
ArrowUp

Enter

Space

Escape

Backspace
```

---

### Arrow Down

```jsx
case "ArrowDown":

 setHighlightedIndex(
   prev =>
     Math.min(
       prev + 1,
       options.length - 1
     )
 );
 break;
```

---

### Arrow Up

```jsx
case "ArrowUp":

 setHighlightedIndex(
   prev =>
     Math.max(prev - 1, 0)
 );

 break;
```

---

### Enter

Select highlighted item.

```jsx
case "Enter":

 toggleOption(
   options[
     highlightedIndex
   ]
 );

 break;
```

---

### Space

Industry standard.

```jsx
case " ":

 event.preventDefault();

 toggleOption(
   options[
     highlightedIndex
   ]
 );

 break;
```

---

### Escape

```jsx
case "Escape":

 setIsOpen(false);

 break;
```

---

### Backspace

Remove last chip.

```jsx
case "Backspace":

 if (
   !search &&
   selectedOptions.length
 ) {

   const last =
     selectedOptions.at(
       -1
     );

   toggleOption(last);
 }

 break;
```

---

# 5. Custom Option Rendering

Current:

```jsx
<option.label>
```

Not reusable.

---

## Add renderOption Prop

```jsx
<SelectDropdown
  renderOption={(user) => (
    <div className="user-row">
      <img src={user.avatar} alt="" />

      <div>
        <h4>{user.name}</h4>

        <span>{user.email}</span>
      </div>
    </div>
  )}
/>
```

---

## Component

```jsx
{
  renderOption ? renderOption(option) : option.label;
}
```

---

## Example

```txt
👤 Sudhir Jedhe
   sudhir@company.com

👤 Apoorva Verma
   apoorva@company.com
```

---

# Production Props

```ts
interface SelectDropdown<T> {
  options: T[];

  value: T | T[];

  onChange: (value: T | T[]) => void;

  searchable?: boolean;

  isMulti?: boolean;

  virtualized?: boolean;

  renderOption?: (option: T) => ReactNode;

  asyncSearch?: boolean;

  placeholder?: string;

  loading?: boolean;
}
```

---

# Enterprise-Level Optimizations

```txt
✅ Debounced Search

✅ Server-Side Search

✅ Infinite Scroll

✅ Virtualization

✅ React.memo

✅ Custom Rendering

✅ Multi Select

✅ ARIA

✅ Keyboard Navigation

✅ Backspace Chip Removal

✅ Async Loading State

✅ Request Cancellation (AbortController)

✅ Caching
```

# Senior React Interview Answer

> For large datasets, I combine server-side search and virtualization. The search query is debounced and sent to the backend, which returns only a paginated subset of matching options. I then render those options using `react-window`, ensuring only visible rows are mounted. For multi-select functionality, I maintain an array of selected values and display them as removable chips. Keyboard interactions support Arrow keys, Enter, Space, Escape, and Backspace for accessibility and productivity. To maximize reusability, I expose a `renderOption` prop so consumers can customise how options are displayed, such as showing avatars, icons, metadata, or complex layouts.

These are exactly the **Senior React interview follow-ups** after building a reusable dropdown.

---

# 1. Server-Side Search API Integration

## Why Server-Side Search?

Suppose:

```txt
Users = 1,000,000
```

Never do:

```js
fetchAllUsers();
```

and search in browser.

Instead:

```txt
User Types
      ↓
Debounce
      ↓
API Call
      ↓
Return Top 20 Matches
```

---

## Backend API

```http
GET /api/users?search=sud&page=1&pageSize=20
```

Response:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Sudhir Jedhe",
      "email": "sudhir@test.com",
      "avatar": "/avatar1.png"
    }
  ],
  "hasMore": true
}
```

---

## API Service

```jsx
export async function searchUsers(query, page = 1, signal) {
  const response = await fetch(
    `/api/users?search=${query}&page=${page}&pageSize=20`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}
```

---

## Debounced Search Hook

```jsx
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  if (!debouncedSearch) return;

  const controller = new AbortController();

  async function fetchData() {
    const result = await searchUsers(debouncedSearch, 1, controller.signal);

    setOptions(result.items);
  }

  fetchData();

  return () => controller.abort();
}, [debouncedSearch]);
```

---

## Execution Flow

```txt
"S"
"SU"
"SUD"

Wait 500ms
       ↓
GET /users?search=sud
       ↓
20 Results Returned
```

---

# 2. Multi-Select Keyboard Navigation

Users expect:

```txt
ArrowDown
ArrowUp
Enter
Space
Esc
Backspace
```

---

## State

```jsx
const [highlightedIndex, setHighlightedIndex] = useState(0);

const [isOpen, setIsOpen] = useState(false);

const [selectedOptions, setSelectedOptions] = useState([]);
```

---

## Keyboard Handler

```jsx
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();

      setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));

      break;

    case "ArrowUp":
      event.preventDefault();

      setHighlightedIndex((prev) => Math.max(prev - 1, 0));

      break;

    case "Enter":
      event.preventDefault();

      toggleOption(options[highlightedIndex]);

      break;

    case " ":
      event.preventDefault();

      toggleOption(options[highlightedIndex]);

      break;

    case "Escape":
      setIsOpen(false);

      break;

    case "Backspace":
      if (search === "" && selectedOptions.length) {
        removeOption(selectedOptions.at(-1));
      }

      break;

    default:
      break;
  }
}
```

---

## Keyboard Experience

```txt
↓
↓
↓

Highlighted:
React

Enter

Selected:
✓ React

Backspace

Removed:
React
```

---

# 3. Multi-Select Toggle Logic

```jsx
function toggleOption(option) {
  const selected = selectedOptions.some((item) => item.id === option.id);

  if (selected) {
    setSelectedOptions((prev) => prev.filter((item) => item.id !== option.id));
  } else {
    setSelectedOptions((prev) => [...prev, option]);
  }
}
```

---

# Chip Rendering

```jsx
<div className="chips">
  {selectedOptions.map((option) => (
    <div key={option.id} className="chip">
      {option.name}

      <button onClick={() => toggleOption(option)}>×</button>
    </div>
  ))}
</div>
```

UI:

```txt
[React ×]
[TypeScript ×]
[Node ×]
```

---

# 4. Custom Option Rendering

A reusable dropdown should never assume:

```txt
option.label
```

because consumers may want:

```txt
Avatar
Email
Department
Country Flag
Icons
```

---

## renderOption Prop

```jsx
<SelectDropdown
  renderOption={(user) => (
    <div className="user-row">
      <img src={user.avatar} alt="" width={32} height={32} />

      <div>
        <div>{user.name}</div>

        <small>{user.email}</small>
      </div>
    </div>
  )}
/>
```

---

## Component

```jsx
{
  renderOption ? renderOption(option) : option.label;
}
```

---

## Visual Result

```txt
👤 Sudhir Jedhe
   sudhir@test.com

👤 Apoorva Verma
   apoorva@test.com
```

---

# 5. Virtualization + Custom Rendering

Install:

```bash
npm install react-window
```

---

## Row Renderer

```jsx
function Row({ index, style, data }) {
  const option = data.options[index];

  return (
    <div
      style={style}
      className="row"
      onClick={() => data.toggleOption(option)}
    >
      {data.renderOption ? data.renderOption(option) : option.label}
    </div>
  );
}
```

---

## Virtualized List

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={300}
  width="100%"
  itemCount={options.length}
  itemSize={60}
  itemData={{
    options,
    toggleOption,
    renderOption,
  }}
>
  {Row}
</FixedSizeList>;
```

---

# Why Virtualization?

Without virtualization:

```txt
50,000 users
↓
50,000 DOM nodes
```

Bad:

```txt
Large memory
Slow scrolling
Long initial render
```

---

With virtualization:

```txt
50,000 users
↓
Only 20-40 visible rows
```

Result:

```txt
Fast rendering
Smooth scrolling
Low memory usage
```

---

# Production-Level Component API

```tsx
<SelectDropdown
  options={users}
  value={selectedUsers}
  onChange={setSelectedUsers}
  isMulti={true}
  searchable={true}
  virtualized={true}
  asyncSearch={true}
  renderOption={(user) => <UserOption user={user} />}
  getLabel={(user) => user.name}
  getValue={(user) => user.id}
/>
```

---

# Senior React Interview Answer

> For enterprise-scale dropdowns, I use debounced server-side search so that only matching records are fetched instead of loading the entire dataset. I combine that with `react-window` virtualization to render only visible rows. Multi-select support is implemented using a selected-values array and removable chips. Keyboard accessibility supports Arrow keys, Enter, Space, Escape, and Backspace, while `renderOption` allows consumers to customise how options appear, such as displaying avatars, emails, departments, or rich metadata without changing the dropdown’s core logic.
