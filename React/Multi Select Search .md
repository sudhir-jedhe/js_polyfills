An accessible React Multi-Select Search (combobox with tags/chips) supporting real-time filtering, keyboard navigation (Arrow keys, Backspace to delete tags, Enter to toggle), tag removal, and click-outside handling.

---

### Component Implementation

```tsx
import React, { useState, useRef, useEffect, useMemo, KeyboardEvent } from 'react';

interface Option {
  id: string;
  label: string;
}

const AVAILABLE_OPTIONS: Option[] = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'JavaScript' },
  { id: '4', label: 'Node.js' },
  { id: '5', label: 'Tailwind CSS' },
  { id: '6', label: 'Next.js' },
  { id: '7', label: 'GraphQL' },
  { id: '8', label: 'Docker' },
];

export const MultiSelectSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Option[]>([
    { id: '1', label: 'React' },
    { id: '2', label: 'TypeScript' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return AVAILABLE_OPTIONS.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()) &&
        !selected.some((s) => s.id === opt.id)
    );
  }, [query, selected]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length]);

  const addOption = (option: Option) => {
    setSelected((prev) => [...prev, option]);
    setQuery('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const removeOption = (id: string) => {
    setSelected((prev) => prev.filter((item) => item.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      // Remove last tag when backspacing on empty input
      removeOption(selected[selected.length - 1].id);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredOptions[highlightedIndex]) {
        addOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: '480px',
        margin: '40px auto',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      <label
        id="multi-select-label"
        style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}
      >
        Select Technologies:
      </label>

      {/* Input / Tags Container Box */}
      <div
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          border: '1.5px solid #cbd5e1',
          borderRadius: '8px',
          backgroundColor: '#fff',
          cursor: 'text',
          minHeight: '44px',
        }}
      >
        {/* Selected Tags */}
        {selected.map((item) => (
          <span
            key={item.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {item.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(item.id);
              }}
              aria-label={`Remove ${item.label}`}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#0284c7',
                fontSize: '14px',
                lineHeight: 1,
                padding: 0,
              }}
            >
              &times;
            </button>
          </span>
        ))}

        {/* Search Input Field */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby="multi-select-label"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? 'Type to search...' : ''}
          style={{
            border: 'none',
            outline: 'none',
            flex: '1 1 80px',
            fontSize: '14px',
            padding: '4px',
          }}
        />
      </div>

      {/* Dropdown Options List */}
      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby="multi-select-label"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            listStyle: 'none',
            padding: '6px 0',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 50,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => addOption(opt)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: isHighlighted ? '#f1f5f9' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#1e293b',
                  }}
                >
                  {opt.label}
                </li>
              );
            })
          ) : (
            <li style={{ padding: '8px 14px', color: '#94a3b8', fontSize: '14px' }}>
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

```

---

### Core Features

* **Combobox ARIA Pattern**: Uses `role="combobox"`, `role="listbox"`, and `role="option"` with `aria-expanded` and `aria-haspopup`.
* **Backspace to Pop**: Pressing backspace in an empty search box automatically deletes the most recently selected tag.
* **Auto-Clamping Filter**: Excludes already-selected tags from appearing inside the available options dropdown.
