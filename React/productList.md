Below is a **complete React.js E-Commerce Product Listing Page** implementation covering:

✅ Product Listing

✅ Search

✅ Category Filtering

✅ Price Filtering

✅ Add Product

✅ Update Product

✅ Delete Product

✅ Responsive UI

✅ React Hooks

✅ Memoized Filtering

✅ Interview Ready

***

# Folder Structure

```text
src/
│
├── App.js
├── ProductForm.js
├── ProductList.js
├── ProductCard.js
├── FilterBar.js
├── styles.css
└── data.js
```

***

# data.js

```js
export const initialProducts = [
  {
    id: 1,
    name: "iPhone 15",
    category: "Mobile",
    price: 900,
    image:
      "https://picsum.photos/id/1/200/200"
  },
  {
    id: 2,
    name: "MacBook Pro",
    category: "Laptop",
    price: 1800,
    image:
      "https://picsum.photos/id/2/200/200"
  },
  {
    id: 3,
    name: "AirPods",
    category: "Accessories",
    price: 200,
    image:
      "https://picsum.photos/id/3/200/200"
  }
];
```

***

# ProductCard.js

```jsx
import React from "react";

function ProductCard({
  product,
  onEdit,
  onDelete
}) {
  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>{product.category}</p>

      <h4>
        ${product.price}
      </h4>

      <button
        onClick={() =>
          onEdit(product)
        }
      >
        Edit
      </button>

      <button
        onClick={() =>
          onDelete(product.id)
        }
      >
        Delete
      </button>
    </div>
  );
}

export default React.memo(
  ProductCard
);
```

***

# ProductList.js

```jsx
import ProductCard from "./ProductCard";

function ProductList({
  products,
  onEdit,
  onDelete
}) {
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ProductList;
```

***

# FilterBar.js

```jsx
function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  maxPrice,
  setMaxPrice
}) {
  return (
    <div className="filters">
      <input
        placeholder="Search..."
        value={search}
        onChange={e =>
          setSearch(
            e.target.value
          )
        }
      />

      <select
        value={category}
        onChange={e =>
          setCategory(
            e.target.value
          )
        }
      >
        <option value="">
          All Categories
        </option>

        <option value="Mobile">
          Mobile
        </option>

        <option value="Laptop">
          Laptop
        </option>

        <option value="Accessories">
          Accessories
        </option>
      </select>

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={e =>
          setMaxPrice(
            e.target.value
          )
        }
      />
    </div>
  );
}

export default FilterBar;
```

***

# ProductForm.js

```jsx
import React, {
  useEffect,
  useState
} from "react";

export default function ProductForm({
  addProduct,
  editingProduct,
  updateProduct
}) {
  const [form, setForm] =
    useState({
      name: "",
      category: "",
      price: "",
      image: ""
    });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const handleSubmit = e => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct(form);
    } else {
      addProduct(form);
    }

    setForm({
      name: "",
      category: "",
      price: "",
      image: ""
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form"
    >
      <input
        placeholder="Name"
        value={form.name}
        onChange={e =>
          setForm({
            ...form,
            name:
              e.target.value
          })
        }
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={e =>
          setForm({
            ...form,
            category:
              e.target.value
          })
        }
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={e =>
          setForm({
            ...form,
            price:
              e.target.value
          })
        }
      />

      <input
        placeholder="Image URL"
        value={form.image}
        onChange={e =>
          setForm({
            ...form,
            image:
              e.target.value
          })
        }
      />

      <button type="submit">
        {editingProduct
          ? "Update"
          : "Add Product"}
      </button>
    </form>
  );
}
```

***

# App.js

```jsx
import React,
{
  useMemo,
  useState
} from "react";

import "./styles.css";

import {
  initialProducts
} from "./data";

import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import FilterBar from "./FilterBar";

export default function App() {
  const [
    products,
    setProducts
  ] = useState(
    initialProducts
  );

  const [
    search,
    setSearch
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("");

  const [
    maxPrice,
    setMaxPrice
  ] = useState("");

  const [
    editingProduct,
    setEditingProduct
  ] = useState(null);

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        product => {
          const matchesSearch =
            product.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesCategory =
            !category ||
            product.category ===
              category;

          const matchesPrice =
            !maxPrice ||
            product.price <=
              Number(
                maxPrice
              );

          return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice
          );
        }
      );
    }, [
      products,
      search,
      category,
      maxPrice
    ]);

  const addProduct =
    product => {
      setProducts(prev => [
        ...prev,
        {
          ...product,
          id: Date.now(),
          price:
            Number(
              product.price
            )
        }
      ]);
    };

  const updateProduct =
    updated => {
      setProducts(prev =>
        prev.map(product =>
          product.id ===
          updated.id
            ? updated
            : product
        )
      );

      setEditingProduct(
        null
      );
    };

  const deleteProduct =
    id => {
      setProducts(prev =>
        prev.filter(
          product =>
            product.id !==
            id
        )
      );
    };

  return (
    <div className="container">
      <h1>
        E-Commerce Store
      </h1>

      <ProductForm
        addProduct={
          addProduct
        }
        editingProduct={
          editingProduct
        }
        updateProduct={
          updateProduct
        }
      />

      <FilterBar
        search={search}
        setSearch={
          setSearch
        }
        category={
          category
        }
        setCategory={
          setCategory
        }
        maxPrice={
          maxPrice
        }
        setMaxPrice={
          setMaxPrice
        }
      />

      <ProductList
        products={
          filteredProducts
        }
        onEdit={
          setEditingProduct
        }
        onDelete={
          deleteProduct
        }
      />
    </div>
  );
}
```

***

# styles.css

```css
* {
  box-sizing: border-box;
}

.container {
  padding: 20px;
}

.form,
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input,
select,
button {
  padding: 10px;
}

.grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(
        250px,
        1fr
      )
    );

  gap: 20px;
}

.card {
  border: 1px solid #ddd;

  padding: 15px;

  border-radius: 8px;

  text-align: center;
}

.card img {
  width: 100%;

  height: 200px;

  object-fit: cover;
}

.card button {
  margin: 5px;
}
```

***

# Senior-Level Enhancements

For React Lead/Frontend Architect interviews, add:

```text
✅ Redux Toolkit / Zustand

✅ Server Side Pagination

✅ Sorting

✅ Debounced Search

✅ Infinite Scroll

✅ Skeleton Loading

✅ Virtualization (react-window)

✅ Shopping Cart

✅ Wishlist

✅ API Integration

✅ Product Details Modal

✅ Unit Tests (RTL + Jest)

✅ Accessibility (ARIA)

✅ Context API Cart
```

### Interview Discussion Points

```text
Filtering Complexity  -> O(n)

Search Optimization   -> Debounce

Large Data Sets       -> Virtualization

API Fetching          -> React Query

State Management      -> Redux Toolkit

Performance           -> useMemo + React.memo
```

This implementation is production-style and covers the most common React machine-coding interview requirements for an e-commerce product listing page.
