*** copy Multi-Filter.md ***

A complete, multi-criteria filtering system in React supporting free-text search, multi-select checkboxes (categories), a range slider (price), and an in-stock toggle using derived state with `useMemo`.

### 1. Multi-Filter Component (`ProductCatalog.jsx`)

```jsx
import React, { useState, useMemo } from 'react';

// Sample Dataset
const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', category: 'Electronics', price: 120, inStock: true },
  { id: 2, name: 'Ergonomic Chair', category: 'Furniture', price: 280, inStock: true },
  { id: 3, name: 'Wireless Mouse', category: 'Electronics', price: 45, inStock: false },
  { id: 4, name: 'Standing Desk', category: 'Furniture', price: 450, inStock: true },
  { id: 5, name: 'Noise-Canceling Headphones', category: 'Audio', price: 199, inStock: true },
  { id: 6, name: 'Studio Monitor Speakers', category: 'Audio', price: 320, inStock: false },
  { id: 7, name: 'USB-C Docking Station', category: 'Electronics', price: 85, inStock: true },
];

const CATEGORIES = ['Electronics', 'Furniture', 'Audio'];

export default function ProductCatalog() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Toggle Category Checkbox
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset All Filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMaxPrice(500);
    setOnlyInStock(false);
  };

  // Derived Filtered List
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // 1. Text Search (Name)
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      // 2. Multi-Select Categories (Inclusive OR across selected tags)
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);

      // 3. Price Range (Max Price limit)
      const matchesPrice = item.price <= maxPrice;

      // 4. In-Stock Boolean Toggle
      const matchesStock = !onlyInStock || item.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [searchQuery, selectedCategories, maxPrice, onlyInStock]);

  return (
    <div style={styles.container}>
      {/* Sidebar / Filters Panel */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.title}>Filters</h3>
          <button onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>

        {/* Text Search */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>Search</label>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Categories (Multi-select) */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>Categories</label>
          {CATEGORIES.map((cat) => (
            <label key={cat} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        {/* Price Slider */}
        <div style={styles.filterGroup}>
          <div style={styles.sliderHeader}>
            <label style={styles.label}>Max Price</label>
            <span style={styles.sliderValue}>${maxPrice}</span>
          </div>
          <input
            type="range"
            min="30"
            max="500"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={styles.range}
          />
        </div>

        {/* In-Stock Toggle */}
        <div style={styles.filterGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
            />
            <span>In-Stock Only</span>
          </label>
        </div>
      </aside>

      {/* Main Results Grid */}
      <main style={styles.resultsArea}>
        <div style={styles.resultsCount}>
          Showing <strong>{filteredProducts.length}</strong> of{' '}
          <strong>{PRODUCTS.length}</strong> products
        </div>

        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>No products match your criteria.</div>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={styles.card}>
                <div style={styles.cardCategory}>{product.category}</div>
                <h4 style={styles.cardTitle}>{product.name}</h4>
                <div style={styles.cardFooter}>
                  <span style={styles.cardPrice}>${product.price}</span>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: product.inStock ? '#e6f4ea' : '#fce8e6',
                      color: product.inStock ? '#137333' : '#c5221f',
                    }}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '32px',
    maxWidth: '1000px',
    margin: '30px auto',
    padding: '0 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#202124',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #dadce0',
    paddingBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#5f6368',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #dadce0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  sliderValue: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  range: {
    width: '100%',
    cursor: 'pointer',
  },
  resultsArea: {
    flexGrow: 1,
  },
  resultsCount: {
    fontSize: '0.9rem',
    color: '#5f6368',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    border: '1px solid #dadce0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  cardCategory: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#80868b',
    fontWeight: '600',
  },
  cardTitle: {
    margin: '8px 0 16px 0',
    fontSize: '1rem',
    color: '#202124',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  badge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#5f6368',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px dashed #dadce0',
  },
};

```

---

### Core Mechanics

* **Derived State via `useMemo`:** Never duplicate items into a secondary `filteredItems` state. Instead, compute results on the fly using `useMemo` based on the active criteria to prevent out-of-sync state bugs.
* **Compound Predicate Evaluation:** The `.filter()` callback tests every item against all four rules concurrently; an item must pass every active check (`AND` logic) to render.
* **Non-destructive Empty Checks:** When `selectedCategories.length === 0`, that specific filter automatically defaults to `true` rather than excluding everything.
