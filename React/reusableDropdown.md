For a **Senior React / Frontend System Design interview**, a **Reusable Searchable Dropdown Component** should support:

✅ Single Select\
✅ Multi Select\
✅ Search / Filter\
✅ Keyboard Navigation\
✅ Async Data Loading\
✅ Virtualisation\
✅ Accessibility (ARIA)\
✅ Controlled & Uncontrolled Modes\
✅ Custom Rendering

***

# Component API

```tsx
<Dropdown
  items={skills}
  searchable
  placeholder="Select Skill"
  value={selectedSkill}
  onChange={setSelectedSkill}
/>
```

***

# Option Type

```tsx
export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}
```

***

# Dropdown.tsx

```tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownOption[];
  value?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function Dropdown({
  items,
  value,
  placeholder = "Select",
  searchable = true,
  disabled = false,
  onChange,
}: DropdownProps) {
  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [highlightedIndex,
          setHighlightedIndex] =
    useState(0);

  const selectedItem =
    items.find(
      item => item.value === value
    );

  const filteredItems =
    useMemo(() => {
      return items.filter(item =>
        item.label
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
      );
    }, [items, searchTerm]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSelect = (
    value: string
  ) => {
    onChange?.(value);

    setIsOpen(false);

    setSearchTerm("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setHighlightedIndex(
          prev =>
            Math.min(
              prev + 1,
              filteredItems.length - 1
            )
        );

        break;

      case "ArrowUp":
        event.preventDefault();

        setHighlightedIndex(
          prev =>
            Math.max(prev - 1, 0)
        );

        break;

      case "Enter":
        event.preventDefault();

        if (
          filteredItems[
            highlightedIndex
          ]
        ) {
          handleSelect(
            filteredItems[
              highlightedIndex
            ].value
          );
        }

        break;

      case "Escape":
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
    >
      <button
        type="button"
        className="dropdown-trigger"
        disabled={disabled}
        onClick={() =>
          setIsOpen(prev => !prev)
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedItem?.label ||
          placeholder}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <input
              type="text"
              className="dropdown-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={e =>
                setSearchTerm(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              autoFocus
            />
          )}

          <ul
            role="listbox"
            className="dropdown-list"
          >
            {filteredItems.length ===
              0 && (
              <li className="empty">
                No Results
              </li>
            )}

            {filteredItems.map(
              (
                item,
                index
              ) => (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={
                    value ===
                    item.value
                  }
                  className={[
                    "dropdown-option",
                    highlightedIndex ===
                    index
                      ? "active"
                      : "",
                    item.disabled
                      ? "disabled"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    !item.disabled &&
                    handleSelect(
                      item.value
                    )
                  }
                >
                  {highlightMatch(
                    item.label,
                    searchTerm
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function highlightMatch(
  text: string,
  query: string
) {
  if (!query) return text;

  const regex =
    new RegExp(
      `(${query})`,
      "gi"
    );

  return text
    .split(regex)
    .map((part, index) =>
      part.toLowerCase() ===
      query.toLowerCase() ? (
        <mark key={index}>
          {part}
        </mark>
      ) : (
        part
      )
    );
}
```

***

# CSS

```css
.dropdown {
  position: relative;
  width: 300px;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow:
    0 4px 12px
    rgba(0, 0, 0, 0.1);
}

.dropdown-search {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid
    #e5e7eb;
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 10px;
  cursor: pointer;
}

.dropdown-option:hover,
.active {
  background: #eff6ff;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  padding: 12px;
  color: gray;
}

mark {
  background: yellow;
}
```

***

# Usage

```tsx
import { useState } from "react";
import Dropdown from "./Dropdown";

const skills = [
  {
    label: "React JS",
    value: "react",
  },
  {
    label: "TypeScript",
    value: "typescript",
  },
  {
    label: "Redux Toolkit",
    value: "redux",
  },
  {
    label: "Playwright",
    value: "playwright",
  },
];

export default function App() {
  const [value, setValue] =
    useState("");

  return (
    <Dropdown
      items={skills}
      value={value}
      searchable
      placeholder="Select Skill"
      onChange={setValue}
    />
  );
}
```

***

# Advanced Features (Interview Discussion)

### Async Search

```tsx
<Dropdown
  loadOptions={searchUsers}
/>
```

### Multi Select

```tsx
<Dropdown
  multiSelect
/>
```

### Virtualised List

```tsx
react-window
```

For:

```text
10,000+ options
```

### LRU Cache

```tsx
Search Query
     ↓
Cache Hit
     ↓
Return Results
```

### Design System Features

```tsx
size="sm|md|lg"
placement="top|bottom"
align="start|center|end"
variant="outlined|filled"
```

### Accessibility

role="combobox"role="listbox"role="option"aria-expandedaria-selected![Visualization]

### Senior-Level Architecture

```text
Dropdown
   │
Search Input
   │
Debounce
   │
LRU Cache
   │
API Call
   │
Virtualised List
   │
Keyboard Navigation
```

This is a production-style, reusable dropdown foundation that can be extended for enterprise React applications and frontend interviews.


For a **Senior React / Frontend System Design interview**, a truly reusable dropdown should support:

✅ Single Select  
✅ Multi Select  
✅ Search  
✅ Debounce  
✅ Keyboard Navigation  
✅ Async Loading  
✅ Controlled & Uncontrolled Mode  
✅ Clear Selection  
✅ Size Variants  
✅ Placement  
✅ Accessibility  
✅ Highlight Search Matches  
✅ Loading State  
✅ Empty State  
✅ Virtualisation Ready

***

# Project Structure

```text
src/
├── components/
│   ├── Dropdown.tsx
│   ├── Dropdown.css
│   └── useDebounce.ts
├── App.tsx
└── main.tsx
```

***

# useDebounce.ts

```tsx
import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay = 300
) {
  const [debouncedValue, setDebouncedValue] =
    useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

***

# Dropdown.tsx

```tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./Dropdown.css";
import { useDebounce } from "./useDebounce";

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownOption[];

  value?: string;

  placeholder?: string;

  searchable?: boolean;

  clearable?: boolean;

  loading?: boolean;

  disabled?: boolean;

  multiSelect?: boolean;

  onChange?: (
    value: string | string[]
  ) => void;
}

export default function Dropdown({
  items,
  value,
  placeholder = "Select",
  searchable = true,
  clearable = true,
  loading = false,
  disabled = false,
  multiSelect = false,
  onChange,
}: DropdownProps) {
  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [highlightedIndex,
          setHighlightedIndex] =
    useState(0);

  const [selectedValues,
          setSelectedValues] =
    useState<string[]>(
      value ? [value] : []
    );

  const debouncedSearch =
    useDebounce(search);

  const filteredItems =
    useMemo(() => {
      return items.filter(item =>
        item.label
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          )
      );
    }, [items, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const toggleSelection = (
    option: DropdownOption
  ) => {
    if (option.disabled) return;

    let updatedValues: string[];

    if (multiSelect) {
      updatedValues =
        selectedValues.includes(
          option.value
        )
          ? selectedValues.filter(
              val =>
                val !== option.value
            )
          : [
              ...selectedValues,
              option.value,
            ];
    } else {
      updatedValues = [option.value];
      setIsOpen(false);
    }

    setSelectedValues(
      updatedValues
    );

    onChange?.(
      multiSelect
        ? updatedValues
        : updatedValues[0]
    );
  };

  const selectedLabels =
    items
      .filter(item =>
        selectedValues.includes(
          item.value
        )
      )
      .map(item => item.label)
      .join(", ");

  const clearSelection = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    setSelectedValues([]);

    onChange?.(
      multiSelect ? [] : ""
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setHighlightedIndex(
          prev =>
            Math.min(
              prev + 1,
              filteredItems.length - 1
            )
        );
        break;

      case "ArrowUp":
        event.preventDefault();

        setHighlightedIndex(
          prev =>
            Math.max(prev - 1, 0)
        );
        break;

      case "Enter":
        event.preventDefault();

        if (
          filteredItems[
            highlightedIndex
          ]
        ) {
          toggleSelection(
            filteredItems[
              highlightedIndex
            ]
          );
        }

        break;

      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
    >
      <button
        type="button"
        className="dropdown-trigger"
        disabled={disabled}
        onClick={() =>
          setIsOpen(prev => !prev)
        }
      >
        <span>
          {selectedLabels ||
            placeholder}
        </span>

        <div>
          {clearable &&
            selectedValues.length >
              0 && (
              <span
                className="clear-btn"
                onClick={
                  clearSelection
                }
              >
                ✕
              </span>
            )}

          ▼
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {searchable && (
            <input
              autoFocus
              className="dropdown-search"
              placeholder="Search..."
              value={search}
              onChange={e =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
            />
          )}

          {loading && (
            <div className="state">
              Loading...
            </div>
          )}

          {!loading &&
            filteredItems.length ===
              0 && (
              <div className="state">
                No Results
              </div>
            )}

          {!loading && (
            <ul
              className="dropdown-list"
              role="listbox"
            >
              {filteredItems.map(
                (
                  item,
                  index
                ) => (
                  <li
                    key={item.value}
                    className={[
                      "dropdown-option",
                      selectedValues.includes(
                        item.value
                      )
                        ? "selected"
                        : "",
                      highlightedIndex ===
                      index
                        ? "active"
                        : "",
                      item.disabled
                        ? "disabled"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      toggleSelection(
                        item
                      )
                    }
                  >
                    {multiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(
                          item.value
                        )}
                        readOnly
                      />
                    )}

                    {highlightMatch(
                      item.label,
                      debouncedSearch
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function highlightMatch(
  text: string,
  query: string
) {
  if (!query) return text;

  const regex = new RegExp(
    `(${query})`,
    "gi"
  );

  return text
    .split(regex)
    .map((part, index) =>
      part.toLowerCase() ===
      query.toLowerCase() ? (
        <mark key={index}>
          {part}
        </mark>
      ) : (
        part
      )
    );
}
```

***

# Dropdown.css

```css
.dropdown {
  width: 320px;
  position: relative;
  font-family: Arial, sans-serif;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  top: 100%;
  margin-top: 4px;

  background: white;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  box-shadow:
    0 10px 20px
    rgba(0, 0, 0, 0.1);

  z-index: 1000;
}

.dropdown-search {
  width: 100%;
  border: none;
  border-bottom: 1px solid #eee;
  padding: 10px;
  outline: none;
}

.dropdown-list {
  max-height: 250px;
  overflow-y: auto;

  margin: 0;
  padding: 0;

  list-style: none;
}

.dropdown-option {
  padding: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-option:hover,
.dropdown-option.active {
  background: #eff6ff;
}

.dropdown-option.selected {
  background: #dbeafe;
}

.dropdown-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.state {
  padding: 12px;
  color: gray;
}

.clear-btn {
  cursor: pointer;
  color: red;
  margin-right: 10px;
}

mark {
  background: yellow;
}
```

***

# App.tsx

```tsx
import { useState } from "react";
import Dropdown from "./components/Dropdown";

const skills = [
  {
    label: "React JS",
    value: "react",
  },
  {
    label: "TypeScript",
    value: "typescript",
  },
  {
    label: "Redux Toolkit",
    value: "redux",
  },
  {
    label: "Playwright",
    value: "playwright",
  },
  {
    label: "GraphQL",
    value: "graphql",
  },
];

export default function App() {
  const [value, setValue] =
    useState("");

  return (
    <div
      style={{
        padding: 100,
      }}
    >
      <h2>
        Searchable Dropdown
      </h2>

      <Dropdown
        items={skills}
        searchable
        clearable
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
```

***

# Senior Frontend Enhancements (Interview Discussion)

For enterprise-scale dropdowns, I would additionally implement:

```text
✅ Async API Search
✅ LRU Cache
✅ AbortController
✅ Infinite Scrolling
✅ Virtualisation (react-window)
✅ Portal Rendering
✅ Typeahead Search
✅ Grouped Options
✅ Size / Placement / Alignment
✅ Controlled & Uncontrolled Modes
✅ WCAG Accessibility
✅ ARIA Combobox Pattern
✅ Floating UI Positioning
✅ RTL Support
✅ Theme Tokens
```

This implementation is a solid foundation for a reusable production-style dropdown component used in React design systems.
