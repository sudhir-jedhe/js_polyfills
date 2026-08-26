import { useState, useEffect, useMemo } from 'react';
import { useToggle, useLocalStorage, useDebounce } from './hooks.js';
import './style.css';

const FRUITS = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
  'Cherry', 'Coconut', 'Cranberry', 'Date', 'Dragonfruit', 'Fig',
  'Grape', 'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Lychee',
  'Mango', 'Melon', 'Nectarine', 'Orange', 'Papaya', 'Passionfruit',
  'Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate', 'Raspberry',
  'Strawberry', 'Tangerine', 'Watermelon',
];

// ---- Demo 1: useToggle driving a modal ----
function ModalDemo() {
  const [isOpen, toggleOpen, close] = useToggle(false);

  return (
    <section className="card">
      <h2>1. useToggle — Modal</h2>
      <p>Boolean state with a stable toggle function.</p>
      <button onClick={toggleOpen}>{isOpen ? 'Close modal' : 'Open modal'}</button>

      {isOpen && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hello from the modal</h3>
            <p>This visibility is controlled entirely by <code>useToggle</code>.</p>
            <button onClick={close}>Dismiss</button>
          </div>
        </div>
      )}
    </section>
  );
}

// ---- Demo 2: useLocalStorage driving a persisted counter ----
function PersistedCounterDemo() {
  const [count, setCount] = useLocalStorage('hooks-playground:counter', 0);

  return (
    <section className="card">
      <h2>2. useLocalStorage — Persisted Counter</h2>
      <p>
        Survives a page reload — refresh the page and this count stays put,
        because it round-trips through <code>localStorage</code> on every change.
      </p>
      <div className="row">
        <button onClick={() => setCount((c) => c - 1)}>-1</button>
        <span className="count">{count}</span>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </section>
  );
}

// ---- Demo 3: useDebounce driving a search box ----
function SearchDemo() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [searchCount, setSearchCount] = useState(0);

  // Simulates a "search request" — only fires when the debounced value
  // actually changes, not on every keystroke.
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) setSearchCount((c) => c + 1);
  }, [debouncedQuery]);

  return (
    <section className="card">
      <h2>3. useDebounce — Search Box</h2>
      <p>
        Typing updates the input instantly, but the "search" (filtering the
        fruit list below) only runs 300ms after you stop typing.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search fruit…"
      />
      <p className="meta">
        Raw input: <code>{query || '(empty)'}</code> — Debounced:{' '}
        <code>{debouncedQuery || '(empty)'}</code> — Searches fired:{' '}
        <strong>{searchCount}</strong>
      </p>
      <ul className="results">
        {results.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <main className="app">
      <h1>Hooks Playground</h1>
      <p className="intro">
        One page, three independently-implemented custom hooks from{' '}
        <code>10-custom-hooks</code>, composed together: <code>useToggle</code>{' '}
        (modal), <code>useLocalStorage</code> (persisted counter), and{' '}
        <code>useDebounce</code> (search box).
      </p>
      <ModalDemo />
      <PersistedCounterDemo />
      <SearchDemo />
    </main>
  );
}
