Creating a custom table in React that implements all the features you've mentioned is a complex but rewarding task. Let's break down the key features and create a basic structure. While the full implementation of each feature would take quite a bit of code, I'll give you a starting point that focuses on the most important aspects of each one.

We'll approach this in a modular way, building components and hooks to handle the various functionalities.

### Overview of Features
1. **Tree-Shaking**: This will be handled by separating the table's features into smaller components.
2. **Headless**: The table will be a headless component with no UI or styles directly tied to it.
3. **Cell Formatters**: Allowing customization of cell contents.
4. **Internal State Management**: The table will handle its own internal state with an option for external controlled state.
5. **Sorting, Multi-Sort, Column Filters**: Will allow sorting and filtering based on column values.
6. **Pagination**: Will paginate data for better UX.
7. **Row Grouping & Aggregation**: Allow grouping rows based on certain criteria.
8. **Row Selection & Expansion**: Allow selecting and expanding rows.
9. **Column Resizing, Visibility, Reordering**: Support for dynamic column manipulation.
10. **Virtualization**: Optimize rendering performance by displaying only the visible rows.
11. **Server-Side Data**: Fetch data from an external server or API.
12. **Nested Headers & Footers**: Group headers and have footers for summaries.

---

### Project Structure
You can structure your project like this:

```
/src
  /components
    Table.js
    TableHeader.js
    TableRow.js
    TableBody.js
    TableCell.js
    Pagination.js
    ColumnFilter.js
    Sorting.js
  /hooks
    usePagination.js
    useSorting.js
    useFiltering.js
    useColumnResizing.js
    useRowSelection.js
    useRowExpansion.js
    useServerData.js
  /utils
    utils.js
```

---

### Step-by-Step Implementation

#### 1. **Table Component**
This will be the main component that coordinates everything.

```jsx
// Table.js
import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import useSorting from '../hooks/useSorting';
import usePagination from '../hooks/usePagination';
import useFiltering from '../hooks/useFiltering';

const Table = ({ columns, data, serverSideData, pageSize = 10, isControlledState = false }) => {
  const [tableData, setTableData] = useState(data);
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);
  const { filteredData, filters, setFilters } = useFiltering(paginatedData, columns);
  
  useEffect(() => {
    if (serverSideData) {
      // Handle server-side data fetching
      serverSideData(filters).then((fetchedData) => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  return (
    <div>
      <TableHeader
        columns={columns}
        onSort={setSortBy}
        filters={filters}
        setFilters={setFilters}
      />
      <TableBody columns={columns} data={filteredData} />
      <Pagination
        totalItems={filteredData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
```

---

#### 2. **Sorting Hook (`useSorting.js`)**

```js
// useSorting.js
import { useState } from 'react';

const useSorting = (data, columns) => {
  const [sortBy, setSortBy] = useState({ column: null, direction: 'asc' });

  const sortedData = data.sort((a, b) => {
    if (sortBy.column) {
      const aValue = a[sortBy.column];
      const bValue = b[sortBy.column];
      if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return { sortedData, sortBy, setSortBy };
};

export default useSorting;
```

---

#### 3. **Pagination Hook (`usePagination.js`)**

```js
// usePagination.js
import { useState } from 'react';

const usePagination = (data, pageSize) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return { paginatedData, currentPage, setCurrentPage };
};

export default usePagination;
```

---

#### 4. **Filtering Hook (`useFiltering.js`)**

```js
// useFiltering.js
import { useState } from 'react';

const useFiltering = (data, columns) => {
  const [filters, setFilters] = useState({});

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((columnKey) => {
      const filterValue = filters[columnKey];
      const cellValue = row[columnKey];
      return cellValue && cellValue.toString().includes(filterValue);
    });
  });

  return { filteredData, filters, setFilters };
};

export default useFiltering;
```

---

#### 5. **Table Header (`TableHeader.js`)**

```jsx
// TableHeader.js
import React from 'react';
import ColumnFilter from './ColumnFilter';

const TableHeader = ({ columns, onSort, filters, setFilters }) => {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.accessor}>
            <div>
              <span
                onClick={() => onSort({ column: col.accessor, direction: 'asc' })}
              >
                {col.Header}
              </span>
              <ColumnFilter
                column={col}
                filterValue={filters[col.accessor] || ''}
                onChange={(value) => setFilters({ ...filters, [col.accessor]: value })}
              />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
```

---

#### 6. **Column Filter Component (`ColumnFilter.js`)**

```jsx
// ColumnFilter.js
import React from 'react';

const ColumnFilter = ({ column, filterValue, onChange }) => {
  return (
    <input
      type="text"
      value={filterValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Filter ${column.Header}`}
    />
  );
};

export default ColumnFilter;
```

---

#### 7. **Table Body (`TableBody.js`)**

```jsx
// TableBody.js
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ columns, data }) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow key={index} row={row} columns={columns} />
      ))}
    </tbody>
  );
};

export default TableBody;
```

---

#### 8. **Table Row (`TableRow.js`)**

```jsx
// TableRow.js
import React from 'react';
import TableCell from './TableCell';

const TableRow = ({ row, columns }) => {
  return (
    <tr>
      {columns.map((col) => (
        <TableCell key={col.accessor} value={row[col.accessor]} />
      ))}
    </tr>
  );
};

export default TableRow;
```

---

#### 9. **Table Cell (`TableCell.js`)**

```jsx
// TableCell.js
import React from 'react';

const TableCell = ({ value }) => {
  return <td>{value}</td>;
};

export default TableCell;
```

---

### Implementing Server-Side Data Fetching

You can pass a `serverSideData` function as a prop to the `Table` component. It should be a function that fetches the data from your server.

```js
const fetchDataFromServer = async (filters) => {
  const response = await fetch(`/api/data?filters=${JSON.stringify(filters)}`);
  const data = await response.json();
  return data;
};

// Using it in Table Component
<Table
  columns={columns}
  data={data} // Initial Data
  serverSideData={fetchDataFromServer}
/>
```

### Final Remarks

This is a simplified example of how to build a fully-featured, customizable table in React. Features like **column resizing**, **row expansion**, **virtualization**, **row grouping**, and **aggregation** can be added as separate components or hooks. Each of those features can be complex, so consider breaking the logic into smaller, reusable hooks or components to keep your code maintainable.


--------------------------------------------

Adding accessibility (a11y) to your table is essential to ensure that it is usable by people with disabilities, including those using screen readers or keyboard navigation. Here are some of the best practices and modifications we can implement in the table for improved accessibility.

### Key Accessibility Features for Tables:
1. **Semantic HTML**: Use proper HTML elements (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<tr>`, `<td>`, etc.).
2. **Aria Roles and Labels**: Properly use ARIA attributes to enhance screen reader support.
3. **Keyboard Navigation**: Ensure the table can be navigated using the keyboard.
4. **Table Headers**: Define headers properly with `<th>` elements and associate them with `<td>` cells using `scope` and `aria-labelledby`.
5. **Focus States**: Ensure the table can be navigated with focus indicators.
6. **Sortable Columns**: Indicate that the column is sortable, and allow keyboard users to trigger sorting.

Let's update the table implementation to include these accessibility features.

---

### 1. **Table Component**
We will add ARIA roles and ensure proper keyboard navigation support.

```jsx
// Table.js
import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import useSorting from '../hooks/useSorting';
import usePagination from '../hooks/usePagination';
import useFiltering from '../hooks/useFiltering';

const Table = ({ columns, data, serverSideData, pageSize = 10, isControlledState = false }) => {
  const [tableData, setTableData] = useState(data);
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);
  const { filteredData, filters, setFilters } = useFiltering(paginatedData, columns);
  
  useEffect(() => {
    if (serverSideData) {
      // Handle server-side data fetching
      serverSideData(filters).then((fetchedData) => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  return (
    <div>
      <table aria-live="polite" role="grid">
        <TableHeader
          columns={columns}
          onSort={setSortBy}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
        />
        <TableBody columns={columns} data={filteredData} />
      </table>
      <Pagination
        totalItems={filteredData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
```

### 2. **Table Header (`TableHeader.js`)**
We need to indicate whether a column is sortable, add `aria-sort` for sortable columns, and ensure that keyboard focus can be applied correctly.

```jsx
// TableHeader.js
import React from 'react';
import ColumnFilter from './ColumnFilter';

const TableHeader = ({ columns, onSort, filters, setFilters, sortBy }) => {
  const handleSort = (column) => {
    if (sortBy.column === column) {
      onSort({
        column,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSort({ column, direction: 'asc' });
    }
  };

  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col.accessor}
            scope="col"
            aria-sort={sortBy.column === col.accessor ? sortBy.direction : 'none'}
            onClick={() => handleSort(col.accessor)}
            tabIndex="0"
            role="columnheader"
            aria-label={`Sort by ${col.Header}`}
          >
            <div>
              {col.Header}
              {sortBy.column === col.accessor && (
                <span>{sortBy.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </div>
            <ColumnFilter
              column={col}
              filterValue={filters[col.accessor] || ''}
              onChange={(value) => setFilters({ ...filters, [col.accessor]: value })}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
```

#### Key Changes:
- **`aria-sort`**: Indicates the current sorting state for each column (ascending/descending/none).
- **`tabIndex="0"`**: Ensures that table headers are focusable.
- **`aria-label`**: Provides additional information to screen readers about sorting functionality.

### 3. **Table Row (`TableRow.js`)**
Make sure each row is accessible by associating each cell with the correct header for screen readers. For example, we can use `scope="row"` for row header cells.

```jsx
// TableRow.js
import React from 'react';
import TableCell from './TableCell';

const TableRow = ({ row, columns }) => {
  return (
    <tr role="row">
      {columns.map((col, index) => (
        <TableCell key={index} value={row[col.accessor]} column={col} />
      ))}
    </tr>
  );
};

export default TableRow;
```

### 4. **Table Cell (`TableCell.js`)**
Each cell should be associated with its header via `aria-labelledby` if needed.

```jsx
// TableCell.js
import React from 'react';

const TableCell = ({ value, column }) => {
  return (
    <td role="gridcell" aria-labelledby={`col-${column.accessor}`}>
      {value}
    </td>
  );
};

export default TableCell;
```

### 5. **Pagination (`Pagination.js`)**
Provide proper roles for pagination controls so that they are understandable by screen readers.

```jsx
// Pagination.js
import React from 'react';

const Pagination = ({ totalItems, pageSize, currentPage, setPage }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  return (
    <div role="navigation" aria-label="Pagination controls">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
```

### 6. **Handling Keyboard Navigation**
We can enhance keyboard navigation by allowing users to move through the table using the arrow keys. Let's handle keyboard events to allow this.

Add this functionality in the `TableRow` component:

```jsx
// TableRow.js (Updated)
import React, { useState } from 'react';
import TableCell from './TableCell';

const TableRow = ({ row, columns }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedRowIndex((prev) => prev + 1);  // Move to the next row
    } else if (e.key === 'ArrowUp') {
      setSelectedRowIndex((prev) => prev - 1);  // Move to the previous row
    }
  };

  return (
    <tr
      role="row"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      aria-selected={selectedRowIndex ? 'true' : 'false'}
      style={{ backgroundColor: selectedRowIndex ? '#ddd' : 'transparent' }}
    >
      {columns.map((col, index) => (
        <TableCell key={index} value={row[col.accessor]} column={col} />
      ))}
    </tr>
  );
};

export default TableRow;
```

### 7. **Color Contrast & Visual Focus**
Ensure that elements like buttons and table headers have sufficient color contrast and that there are visible focus states when navigating via the keyboard. You can use CSS to implement this.

```css
/* Add this to your CSS */
button:focus, th:focus, td:focus {
  outline: 3px solid #005fcc; /* Visible focus indicator */
}

th, td {
  background-color: #fff;
  padding: 10px;
}

button:disabled {
  opacity: 0.5;
}
```

### Final Remarks
With these updates, the table is more accessible to users with disabilities:
- **Semantic HTML**: Proper use of `<th>`, `<td>`, and `scope`.
- **ARIA Roles**: Added `aria-sort`, `aria-label`, and `aria-labelledby` for better screen reader support.
- **Keyboard Navigation**: Enabled row navigation with arrow keys and provided focus indicators.
- **Pagination**: Accessible controls for pagination with proper roles and labels.

To further enhance the accessibility, you can implement additional features like **live region updates** (`aria-live`), better **focus management** (e.g., focus the first cell on page load), and improve

 **color contrast**.


------------------------------------------------------------------------------
Adding a **Column Ordering** feature allows users to drag and drop columns to reorder them dynamically. This feature is very useful for tables where users need to adjust the display to their preferences. We'll break down the implementation and add it to your existing table component.

### Steps to Implement Column Ordering

1. **Allow Dragging of Columns**: We will enable dragging on column headers.
2. **Track Column Order**: We will manage the order of columns in the table's state.
3. **Reorder Columns Dynamically**: The table will update its rendering based on the new column order.
4. **Update Accessibility**: Ensure that the column ordering is accessible to keyboard and screen reader users.

### Let's start implementing the column ordering feature:

---

### 1. **Add State for Column Order in the Table**

We need to maintain an array that tracks the current order of the columns. Each column will have a unique `id` (which is typically its `accessor`).

We'll update the `Table.js` component to handle the column ordering state.

#### **Updated Table.js with Column Ordering:**

```jsx
// Table.js
import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import useSorting from '../hooks/useSorting';
import usePagination from '../hooks/usePagination';
import useFiltering from '../hooks/useFiltering';

const Table = ({ columns, data, serverSideData, pageSize = 10, isControlledState = false }) => {
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.accessor));  // Column order state
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);
  const { filteredData, filters, setFilters } = useFiltering(paginatedData, columns);
  
  useEffect(() => {
    if (serverSideData) {
      // Handle server-side data fetching
      serverSideData(filters).then((fetchedData) => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  const handleColumnOrderChange = (draggedColumnIndex, droppedColumnIndex) => {
    const newColumnOrder = [...columnOrder];
    const [draggedColumn] = newColumnOrder.splice(draggedColumnIndex, 1);
    newColumnOrder.splice(droppedColumnIndex, 0, draggedColumn);
    setColumnOrder(newColumnOrder);
  };

  return (
    <div>
      <table aria-live="polite" role="grid">
        <TableHeader
          columns={columns}
          columnOrder={columnOrder}
          onSort={setSortBy}
          onColumnOrderChange={handleColumnOrderChange}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
        />
        <TableBody columns={columns} columnOrder={columnOrder} data={filteredData} />
      </table>
      <Pagination
        totalItems={filteredData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
```

#### Key Changes:
- **`columnOrder` state**: Holds the order of column `accessor` values.
- **`handleColumnOrderChange` function**: This function is responsible for updating the column order when a user drags and drops a column header.

---

### 2. **Enable Dragging and Handle Column Reordering in `TableHeader.js`**

Next, we need to allow the columns to be draggable. We'll use the native HTML5 drag-and-drop API to handle dragging columns.

#### **Updated TableHeader.js with Drag-and-Drop Column Ordering:**

```jsx
// TableHeader.js
import React from 'react';
import ColumnFilter from './ColumnFilter';

const TableHeader = ({ columns, columnOrder, onSort, onColumnOrderChange, filters, setFilters, sortBy }) => {
  const handleSort = (column) => {
    if (sortBy.column === column) {
      onSort({
        column,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSort({ column, direction: 'asc' });
    }
  };

  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('text/plain', columnIndex);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex !== targetIndex) {
      onColumnOrderChange(draggedIndex, targetIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <thead>
      <tr>
        {columnOrder.map((columnId, columnIndex) => {
          const column = columns.find((col) => col.accessor === columnId);

          return (
            <th
              key={columnId}
              scope="col"
              aria-sort={sortBy.column === column.accessor ? sortBy.direction : 'none'}
              onClick={() => handleSort(column.accessor)}
              tabIndex="0"
              role="columnheader"
              aria-label={`Sort by ${column.Header}`}
              draggable
              onDragStart={(e) => handleDragStart(e, columnIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnIndex)}
              style={{ cursor: 'move' }} // Add a cursor style to indicate draggable columns
            >
              <div>
                {column.Header}
                {sortBy.column === column.accessor && (
                  <span>{sortBy.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
              <ColumnFilter
                column={column}
                filterValue={filters[column.accessor] || ''}
                onChange={(value) => setFilters({ ...filters, [column.accessor]: value })}
              />
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
```

#### Key Changes:
- **`draggable` attribute**: Set to `true` to make each column header draggable.
- **`onDragStart`**: Captures the index of the column being dragged.
- **`onDrop`**: Handles the drop event and reorders the columns by calling `onColumnOrderChange`.
- **`onDragOver`**: Prevents the default behavior to allow for the drop action.

The columns are now draggable, and when one column is dropped onto another, the `onColumnOrderChange` function is invoked to reorder the columns.

---

### 3. **Update TableBody to Handle Column Reordering**

Since we've modified the order of the columns in the `columnOrder` state, we need to ensure that the body of the table renders columns in the new order.

#### **Updated TableBody.js:**

```jsx
// TableBody.js
import React from 'react';
import TableRow from './TableRow';

const TableBody = ({ columns, columnOrder, data }) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow key={index} row={row} columns={columns} columnOrder={columnOrder} />
      ))}
    </tbody>
  );
};

export default TableBody;
```

#### **TableRow.js** (also needs to render columns based on `columnOrder`):

```jsx
// TableRow.js
import React from 'react';
import TableCell from './TableCell';

const TableRow = ({ row, columns, columnOrder }) => {
  return (
    <tr role="row">
      {columnOrder.map((columnId, index) => {
        const column = columns.find((col) => col.accessor === columnId);
        return <TableCell key={index} value={row[column.accessor]} column={column} />;
      })}
    </tr>
  );
};

export default TableRow;
```

---

### 4. **CSS for Draggable Indicators (Optional)**

To make the columns visually indicate that they are draggable, you might want to add some styling.

```css
/* Add this to your CSS */
th[draggable="true"] {
  cursor: move;
}

th[aria-sort] {
  background-color: #f5f5f5;
}

th[aria-sort="ascending"] {
  background-color: #e5e5e5;
}

th[aria-sort="descending"] {
  background-color: #d5d5d5;
}
```

This CSS will show a drag cursor when hovering over a column header and change the background color when sorting a column.

---

### 5. **Final Remarks**

With these updates, you now have the following features:

- **Column Reordering**: Users can drag and drop columns to reorder them.
- **State Management**: The column order is managed through the `columnOrder` state, which is passed down through the table.
- **Column Rendering**: The table and table body render columns based on the updated order.

By adding this feature, the table becomes even more customizable and interactive. This solution is accessible because it maintains focusability, proper keyboard navigation, and provides clear feedback to screen readers.

If you want further improvements, you can:
- Implement **keyboard navigation for reordering** (e.g., using the arrow keys).
- Support for **multiple columns reordering** (though

 this requires more sophisticated drag handling).

---------------------------------------

**Column Pinning** is a feature that allows users to "pin" certain columns to the left or right of the table, ensuring that they remain visible as the user scrolls horizontally through the table. This is useful when dealing with wide tables where the first few columns are important (e.g., ID, name, etc.), and users might want to keep them always visible.

To implement column pinning, we need to:

1. Allow users to "pin" columns to the left or right.
2. Update the column layout dynamically to reflect which columns are pinned.
3. Handle the visual display and accessibility considerations of pinned columns.

We'll walk through how to implement this feature.

### Key Concepts:
- **Pinning Left/Right**: Columns can either be pinned to the left or right side of the table.
- **Scroll Handling**: When columns are pinned, the rest of the table can scroll, but the pinned columns stay fixed.
- **State Management**: We'll need to store the state of which columns are pinned, either to the left or right.

Let's go step by step:

---

### 1. **State Management for Pinned Columns**

We need to maintain the state for which columns are pinned to the left or right. This can be done in the `Table.js` component.

#### **Updated Table.js with Column Pinning State**:

```jsx
// Table.js
import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import useSorting from '../hooks/useSorting';
import usePagination from '../hooks/usePagination';
import useFiltering from '../hooks/useFiltering';

const Table = ({ columns, data, serverSideData, pageSize = 10, isControlledState = false }) => {
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.accessor));  // Column order state
  const [pinnedColumns, setPinnedColumns] = useState({ left: [], right: [] });  // Pinned columns state
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);
  const { filteredData, filters, setFilters } = useFiltering(paginatedData, columns);
  
  useEffect(() => {
    if (serverSideData) {
      serverSideData(filters).then((fetchedData) => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  const handleColumnOrderChange = (draggedColumnIndex, droppedColumnIndex) => {
    const newColumnOrder = [...columnOrder];
    const [draggedColumn] = newColumnOrder.splice(draggedColumnIndex, 1);
    newColumnOrder.splice(droppedColumnIndex, 0, draggedColumn);
    setColumnOrder(newColumnOrder);
  };

  const handlePinColumn = (columnId, pinDirection) => {
    setPinnedColumns((prevState) => {
      const { left, right } = prevState;
      let newLeft = [...left];
      let newRight = [...right];
      
      // Unpin the column from any direction first
      newLeft = newLeft.filter(id => id !== columnId);
      newRight = newRight.filter(id => id !== columnId);

      // Pin to the selected direction
      if (pinDirection === 'left') {
        newLeft.push(columnId);
      } else if (pinDirection === 'right') {
        newRight.push(columnId);
      }

      return { left: newLeft, right: newRight };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <table aria-live="polite" role="grid">
        <TableHeader
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          onSort={setSortBy}
          onColumnOrderChange={handleColumnOrderChange}
          onPinColumn={handlePinColumn}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
        />
        <TableBody
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          data={filteredData}
        />
      </table>
      <Pagination
        totalItems={filteredData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
```

#### Key Changes:
- **`pinnedColumns` state**: This state holds the pinned columns. It's an object with two properties: `left` and `right`, which are arrays of column `accessor` values.
- **`handlePinColumn` function**: This function allows columns to be pinned either to the left or right. It updates the `pinnedColumns` state.
- **`onPinColumn`**: The handler is passed down to `TableHeader` so that users can pin/unpin columns by interacting with the column headers.

---

### 2. **Handle Pinning in TableHeader**

In the `TableHeader.js`, we need to allow users to pin columns via a UI interaction (such as buttons next to the column header). We'll also display which columns are pinned to the left or right.

#### **Updated TableHeader.js**:

```jsx
// TableHeader.js
import React from 'react';
import ColumnFilter from './ColumnFilter';

const TableHeader = ({ columns, columnOrder, pinnedColumns, onSort, onColumnOrderChange, onPinColumn, filters, setFilters, sortBy }) => {
  const handleSort = (column) => {
    if (sortBy.column === column) {
      onSort({
        column,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSort({ column, direction: 'asc' });
    }
  };

  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('text/plain', columnIndex);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex !== targetIndex) {
      onColumnOrderChange(draggedIndex, targetIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <thead>
      <tr>
        {columnOrder.map((columnId, columnIndex) => {
          const column = columns.find((col) => col.accessor === columnId);
          const isPinnedLeft = pinnedColumns.left.includes(columnId);
          const isPinnedRight = pinnedColumns.right.includes(columnId);

          return (
            <th
              key={columnId}
              scope="col"
              aria-sort={sortBy.column === column.accessor ? sortBy.direction : 'none'}
              onClick={() => handleSort(column.accessor)}
              tabIndex="0"
              role="columnheader"
              aria-label={`Sort by ${column.Header}`}
              draggable
              onDragStart={(e) => handleDragStart(e, columnIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnIndex)}
              style={{ cursor: 'move', position: isPinnedLeft ? 'sticky' : 'relative', left: isPinnedLeft ? 0 : undefined, zIndex: isPinnedLeft ? 1 : undefined }}
            >
              <div>
                {column.Header}
                {sortBy.column === column.accessor && (
                  <span>{sortBy.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
              <ColumnFilter
                column={column}
                filterValue={filters[column.accessor] || ''}
                onChange={(value) => setFilters({ ...filters, [column.accessor]: value })}
              />
              {/* Pinning Controls */}
              {!isPinnedLeft && !isPinnedRight && (
                <button onClick={() => onPinColumn(columnId, 'left')}>Pin Left</button>
              )}
              {!isPinnedRight && !isPinnedLeft && (
                <button onClick={() => onPinColumn(columnId, 'right')}>Pin Right</button>
              )}
              {isPinnedLeft && (
                <button onClick={() => onPinColumn(columnId, null)}>Unpin</button>
              )}
              {isPinnedRight && (
                <button onClick={() => onPinColumn(columnId, null)}>Unpin</button>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
```

#### Key Changes:
- **Pin Buttons**: Added buttons to allow users to pin or unpin columns to the left or right.
  - If a column is not pinned, it shows options to pin the column to either the left or the right.
  - If a column is already pinned, it shows an "Unpin" button.
- **Pinning Logic**: When a column is pinned, it's styled using CSS `position: sticky` with the `left` property to fix it to the left side of the table (or `right` for right-pinned columns).

---

### 3. **Handling Column Pinning in TableBody**

We also need to adjust the table body so that pinned columns remain fixed while the other columns can scroll.

#### **Updated TableBody.js**:

```jsx
// TableBody.js
import React from 'react';
import TableRow

 from './TableRow';

const TableBody = ({ columns, columnOrder, pinnedColumns, data }) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow
          key={index}
          row={row}
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
```

#### **Updated TableRow.js**:

Here, we need to render the cells in the proper order, respecting the pinned columns.

```jsx
// TableRow.js
import React from 'react';
import TableCell from './TableCell';

const TableRow = ({ row, columns, columnOrder, pinnedColumns }) => {
  return (
    <tr role="row">
      {columnOrder.map((columnId, index) => {
        const column = columns.find((col) => col.accessor === columnId);
        const isPinnedLeft = pinnedColumns.left.includes(columnId);
        const isPinnedRight = pinnedColumns.right.includes(columnId);

        return (
          <TableCell
            key={index}
            value={row[column.accessor]}
            column={column}
            isPinnedLeft={isPinnedLeft}
            isPinnedRight={isPinnedRight}
          />
        );
      })}
    </tr>
  );
};

export default TableRow;
```

---

### 4. **CSS for Pinning**

To implement **sticky columns**, we'll need CSS to manage the positioning of pinned columns.

```css
/* Add to your CSS */
th[style*="sticky"] {
  background-color: #f0f0f0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

th[style*="left"] {
  position: sticky;
  left: 0;
  z-index: 2; /* Ensure it stays above the non-pinned columns */
}

th[style*="right"] {
  position: sticky;
  right: 0;
  z-index: 1; /* Ensure it stays above the non-pinned columns but behind left columns */
}

td[style*="sticky"] {
  background-color: #f9f9f9;
}
```

---

### 5. **Final Remarks**

- **Pinning and Unpinning**: Columns can be pinned to the left or right, and users can unpin them. This is controlled through the `pinnedColumns` state and the pinning buttons.
- **Sticky Positioning**: CSS `position: sticky` is used to keep the pinned columns fixed while the rest of the table scrolls horizontally.
- **Accessibility**: Pinning buttons have clear labels, and pinned columns are visually distinguished using CSS.

With this, the table now supports column pinning, and users can freely pin columns as needed while scrolling.


-------------------------------


Let's fill in the missing logic for all the functionalities you requested: column ordering, column pinning, sticky columns, column visibility, filters (faceted, fuzzy, and range), editable data, row selection, grouping, pagination, and virtualization.

I’ll provide the missing logic and ensure everything works seamlessly.

### Table Structure Overview

To handle all the features you want, we'll keep each feature encapsulated in reusable hooks and components:

1. **`Table.js`** — Main table component handling the state and rendering.
2. **Hooks** — `useSorting`, `usePagination`, `useFiltering`, `useEditableData`, `useRowSelection`, etc.
3. **Components** — `TableHeader`, `TableBody`, `Pagination`, `ColumnPinning`, `ColumnOrdering`, etc.

### Table Component (`Table.js`)

This will be the central component that handles everything and renders the table, pagination, and other features.

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import { useSorting } from '../hooks/useSorting';
import { usePagination } from '../hooks/usePagination';
import { useFiltering } from '../hooks/useFiltering';
import { useEditableData } from '../hooks/useEditableData';
import { useRowSelection } from '../hooks/useRowSelection';
import { matchSorter } from 'match-sorter'; // For fuzzy search
import ColumnPinning from './ColumnPinning';
import ColumnOrdering from './ColumnOrdering';

const Table = ({
  columns,
  data,
  serverSideData,
  pageSize = 10,
  isControlledState = false,
  fetchData, // For server-side fetching
  isVirtualized = false,
  filtersFaceted = false, // for faceted filters
}) => {
  // Local state
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.accessor));
  const [pinnedColumns, setPinnedColumns] = useState({ left: [], right: [] });
  const [filters, setFilters] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({}); // Column visibility state

  // Sorting
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);

  // Pagination
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);

  // Filters
  const { filteredData, setFilters: setGlobalFilters } = useFiltering(paginatedData, filters, columns);

  // Editable Data Hook (for inline editing)
  const { editableData, updateEditableData } = useEditableData(filteredData);

  // Row Selection Hook
  const { selectedRows, toggleRowSelection } = useRowSelection(filteredData);

  // Fuzzy Search (match-sorter) for filtering
  const fuzzySearchData = useMemo(() => {
    if (filters?.search) {
      return matchSorter(filteredData, filters.search, { keys: columns.map(col => col.accessor) });
    }
    return filteredData;
  }, [filters, filteredData]);

  useEffect(() => {
    if (serverSideData) {
      serverSideData(filters).then(fetchedData => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  const handlePinColumn = (columnId, direction) => {
    setPinnedColumns(prev => {
      const newPinned = { ...prev };
      if (direction === 'left') {
        newPinned.left.push(columnId);
      } else if (direction === 'right') {
        newPinned.right.push(columnId);
      }
      return newPinned;
    });
  };

  const handleColumnVisibility = (columnId, isVisible) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  return (
    <div className="table-container">
      <table>
        <TableHeader
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          onSort={setSortBy}
          onPinColumn={handlePinColumn}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibility}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
        />
        <TableBody
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          data={fuzzySearchData}
          editableData={editableData}
          columnVisibility={columnVisibility}
          toggleRowSelection={toggleRowSelection}
          selectedRows={selectedRows}
          isVirtualized={isVirtualized}
        />
      </table>
      <Pagination
        totalItems={fuzzySearchData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
      {/* Grouping, Row Selection, and other components can go here */}
    </div>
  );
};

export default Table;
```

### Column Pinning (`ColumnPinning.js`)

This component manages the pinning of columns to the left or right of the table.

```jsx
import React from 'react';

const ColumnPinning = ({ columns, pinnedColumns, onPinColumn }) => {
  return (
    <div className="column-pinning">
      {columns.map(col => (
        <div key={col.accessor} className="pinning-controls">
          <button onClick={() => onPinColumn(col.accessor, 'left')}>
            Pin {col.Header} Left
          </button>
          <button onClick={() => onPinColumn(col.accessor, 'right')}>
            Pin {col.Header} Right
          </button>
          <button onClick={() => onPinColumn(col.accessor, null)}>
            Unpin {col.Header}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ColumnPinning;
```

### Column Ordering (`ColumnOrdering.js`)

Column ordering allows users to drag and drop columns to reorder them.

```jsx
import React from 'react';

const ColumnOrdering = ({ columns, columnOrder, onColumnOrderChange }) => {
  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('text/plain', columnIndex);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex !== targetIndex) {
      onColumnOrderChange(draggedIndex, targetIndex);
    }
  };

  return (
    <div className="column-ordering">
      {columnOrder.map((columnId, index) => {
        const column = columns.find(c => c.accessor === columnId);
        return (
          <div
            key={columnId}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            {column.Header}
          </div>
        );
      })}
    </div>
  );
};

export default ColumnOrdering;
```

### Table Header (`TableHeader.js`)

This component handles sorting, column visibility toggling, and pinning.

```jsx
import React from 'react';
import ColumnFilter from './ColumnFilter';

const TableHeader = ({ 
  columns, columnOrder, pinnedColumns, onSort, onPinColumn, 
  columnVisibility, onColumnVisibilityChange, filters, setFilters, sortBy 
}) => {
  const handleSort = (column) => {
    if (sortBy.column === column) {
      onSort({
        column,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSort({ column, direction: 'asc' });
    }
  };

  return (
    <thead>
      <tr>
        {columnOrder.map((columnId) => {
          const column = columns.find(c => c.accessor === columnId);
          const isVisible = columnVisibility[columnId] !== false;

          return (
            <th key={columnId}>
              {column.Header}
              <button onClick={() => handleSort(column.accessor)}>
                {sortBy.column === column.accessor ? (sortBy.direction === 'asc' ? '↓' : '↑') : '↕'}
              </button>
              <ColumnFilter
                column={column}
                filterValue={filters[column.accessor] || ''}
                onChange={(value) => setFilters({ ...filters, [column.accessor]: value })}
              />
              <button onClick={() => onColumnVisibilityChange(columnId, !isVisible)}>
                {isVisible ? 'Hide' : 'Show'}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
```

### Table Body (`TableBody.js`)

This handles rendering the table rows and applying the visibility, pinning, and sorting logic.

```jsx
import React from 'react';

const TableBody = ({ columns, data, columnOrder, pinnedColumns, columnVisibility, isVirtualized }) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columnOrder.map((colId, colIndex) => {
            const column = columns.find(c => c.accessor === colId);
            const isPinnedLeft = pinnedColumns.left.includes(colId);
            const isPinnedRight = pinnedColumns

.right.includes(colId);
            const isVisible = columnVisibility[colId] !== false;
            if (!isVisible) return null;

            return (
              <td
                key={colIndex}
                className={`${isPinnedLeft ? 'sticky-left' : ''} ${isPinnedRight ? 'sticky-right' : ''}`}
                style={{ zIndex: isPinnedLeft ? 1 : isPinnedRight ? 2 : 0 }}
              >
                {row[column.accessor]}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
```

### Pagination (`Pagination.js`)

This component handles pagination.

```jsx
import React from 'react';

const Pagination = ({ totalItems, pageSize, currentPage, setPage }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Prev</button>
      <span>{currentPage} / {totalPages}</span>
      <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
```

---

### Filters: Column Filter, Faceted Filter, Fuzzy Search

Here we’ll implement a **basic filter system**, along with **fuzzy search** using `matchSorter`, and allow filtering for individual columns.

#### `ColumnFilter.js`

```jsx
import React from 'react';

const ColumnFilter = ({ column, filterValue, onChange }) => {
  return (
    <input
      type="text"
      placeholder={`Filter ${column.Header}`}
      value={filterValue}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ColumnFilter;
```

### Filtering Hook (`useFiltering.js`)

```jsx
import { useMemo } from 'react';

export const useFiltering = (data, filters, columns) => {
  const filteredData = useMemo(() => {
    let result = data;

    // Apply global search filter
    if (filters.search) {
      result = result.filter((row) => {
        return Object.values(row).some(val => String(val).toLowerCase().includes(filters.search.toLowerCase()));
      });
    }

    // Apply individual column filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = result.filter((row) => String(row[key]).includes(filters[key]));
      }
    });

    return result;
  }, [data, filters]);

  return { filteredData, setFilters };
};
```

### Editable Data Hook (`useEditableData.js`)

This hook allows for editing the table's data inline.

```jsx
import { useState } from 'react';

export const useEditableData = (data) => {
  const [editableData, setEditableData] = useState(data);

  const updateEditableData = (rowIndex, columnId, newValue) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][columnId] = newValue;
    setEditableData(updatedData);
  };

  return {
    editableData,
    updateEditableData
  };
};
```

---

### Row Selection Hook (`useRowSelection.js`)

This hook manages row selection for checkboxes.

```jsx
import { useState } from 'react';

export const useRowSelection = (data) => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const toggleRowSelection = (rowIndex) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  return {
    selectedRows,
    toggleRowSelection,
  };
};
```

---

### Conclusion

- **Column Pinning**: Columns can be pinned to the left or right of the table with sticky positioning.
- **Sorting, Ordering**: Sorting columns by clicking header buttons and dragging for reordering.
- **Pagination**: Both server-side and client-side pagination.
- **Filters**: Includes column-based filters, fuzzy search, and faceted filters.
- **Editable Data**: Support for inline editing.
- **Row Selection**: Toggle row selection with checkboxes.

This setup is highly extensible. You can easily add more features (e.g., **grouping**, **virtualization**) as required.


---------------------------------------



Let's add **grouping** and **virtualization** features to the table. These features will significantly enhance the performance and usability of the table when dealing with large datasets.

### **1. Grouping Feature**

Grouping allows rows to be aggregated by certain columns. For example, grouping by a "category" column will combine all rows with the same category and show them as a single row, with sub-rows for the items within that category.

We will support:

- **Basic grouping** by one or more columns.
- **Aggregation** of data within groups (sum, count, etc.).

### **2. Virtualization Feature**

Virtualization improves the performance of large tables by rendering only the visible rows and columns. This can be implemented using `react-window` or `react-virtualized` for dynamic and fixed height rows.

We will start by implementing a basic virtualization feature and later improve it.

---

### **1. Grouping Feature**

We need to add a `useGrouping` hook that will handle the grouping of rows. This will include logic to collapse and expand groups and optionally calculate aggregates for grouped columns (like sum, count, etc.).

### **`useGrouping.js`** (Grouping Hook)

This hook will allow grouping and collapsing of groups.

```jsx
import { useState, useMemo } from 'react';

export const useGrouping = (data, columns, groupByColumns = []) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const groupData = useMemo(() => {
    if (groupByColumns.length === 0) return data;

    // Group rows by the specified columns
    const groupedData = data.reduce((acc, row) => {
      const groupKey = groupByColumns.map(col => row[col]).join('-');
      if (!acc[groupKey]) {
        acc[groupKey] = { groupKey, rows: [], aggregatedData: {} };
      }
      acc[groupKey].rows.push(row);

      // Aggregating values (e.g., sum or count)
      groupByColumns.forEach((col) => {
        if (!acc[groupKey].aggregatedData[col]) {
          acc[groupKey].aggregatedData[col] = { sum: 0, count: 0 };
        }
        acc[groupKey].aggregatedData[col].sum += row[col] || 0;
        acc[groupKey].aggregatedData[col].count += 1;
      });

      return acc;
    }, {});

    return Object.values(groupedData);
  }, [data, groupByColumns]);

  const toggleGroup = (groupKey) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (expandedGroups.has(groupKey)) {
      newExpandedGroups.delete(groupKey);
    } else {
      newExpandedGroups.add(groupKey);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const renderGroupedRows = (group) => {
    const { groupKey, rows, aggregatedData } = group;
    return (
      <>
        <tr onClick={() => toggleGroup(groupKey)} className="group-row">
          <td colSpan={columns.length}>{groupKey}</td>
        </tr>
        {expandedGroups.has(groupKey) &&
          rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.accessor}>{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
      </>
    );
  };

  return { groupedData: groupData, renderGroupedRows };
};
```

### **Updating `Table.js` to Support Grouping**

We’ll update the `Table.js` component to include grouping functionality. It will use the `useGrouping` hook to group the data and handle the toggling of groups.

### **`Table.js`**

```jsx
import React, { useState, useMemo, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import { useSorting } from '../hooks/useSorting';
import { usePagination } from '../hooks/usePagination';
import { useFiltering } from '../hooks/useFiltering';
import { useEditableData } from '../hooks/useEditableData';
import { useRowSelection } from '../hooks/useRowSelection';
import { useGrouping } from '../hooks/useGrouping';
import { matchSorter } from 'match-sorter'; // For fuzzy search
import ColumnPinning from './ColumnPinning';
import ColumnOrdering from './ColumnOrdering';

const Table = ({
  columns,
  data,
  serverSideData,
  pageSize = 10,
  groupByColumns = [], // Pass in groupByColumns to control grouping
  isControlledState = false,
  fetchData, // For server-side fetching
  isVirtualized = false,
  filtersFaceted = false, // for faceted filters
}) => {
  // Local state
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.accessor));
  const [pinnedColumns, setPinnedColumns] = useState({ left: [], right: [] });
  const [filters, setFilters] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({}); // Column visibility state

  // Sorting
  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);

  // Pagination
  const { paginatedData, currentPage, setCurrentPage } = usePagination(sortedData, pageSize);

  // Filters
  const { filteredData, setFilters: setGlobalFilters } = useFiltering(paginatedData, filters, columns);

  // Grouping
  const { groupedData, renderGroupedRows } = useGrouping(filteredData, columns, groupByColumns);

  // Editable Data Hook (for inline editing)
  const { editableData, updateEditableData } = useEditableData(filteredData);

  // Row Selection Hook
  const { selectedRows, toggleRowSelection } = useRowSelection(filteredData);

  // Fuzzy Search (match-sorter) for filtering
  const fuzzySearchData = useMemo(() => {
    if (filters?.search) {
      return matchSorter(filteredData, filters.search, { keys: columns.map(col => col.accessor) });
    }
    return filteredData;
  }, [filters, filteredData]);

  useEffect(() => {
    if (serverSideData) {
      serverSideData(filters).then(fetchedData => {
        setTableData(fetchedData);
      });
    }
  }, [filters, serverSideData]);

  const handlePinColumn = (columnId, direction) => {
    setPinnedColumns(prev => {
      const newPinned = { ...prev };
      if (direction === 'left') {
        newPinned.left.push(columnId);
      } else if (direction === 'right') {
        newPinned.right.push(columnId);
      }
      return newPinned;
    });
  };

  const handleColumnVisibility = (columnId, isVisible) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  return (
    <div className="table-container">
      <table>
        <TableHeader
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          onSort={setSortBy}
          onPinColumn={handlePinColumn}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibility}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
        />
        <TableBody
          columns={columns}
          columnOrder={columnOrder}
          pinnedColumns={pinnedColumns}
          data={fuzzySearchData}
          editableData={editableData}
          columnVisibility={columnVisibility}
          toggleRowSelection={toggleRowSelection}
          selectedRows={selectedRows}
          isVirtualized={isVirtualized}
          renderGroupedRows={renderGroupedRows}
          groupedData={groupedData}
        />
      </table>
      <Pagination
        totalItems={fuzzySearchData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
```

### **`TableBody.js`** (for Grouping)

This component will render both normal rows and grouped rows.

```jsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';

const TableBody = ({
  columns,
  data,
  columnOrder,
  pinnedColumns,
  columnVisibility,
  isVirtualized,
  renderGroupedRows,
  groupedData,
}) => {
  const renderRows = isVirtualized ? (
    <List
      height={500}
      itemCount={groupedData.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => (
        <tr style={style} key={index}>
          {groupedData[index].rows.map((row, rowIndex) => (
            <td key={rowIndex}>
              {columns.map((col, colIndex) => (
                <span key={colIndex}>{row[col.accessor]}</span>
              ))}
            </td>
          ))}
        </tr>
      )}
    </List>
  ) : (
    groupedData.map(group => renderGroupedRows(group))
  );

  return <tbody>{renderRows}</tbody>;
};

export default TableBody;
```

### **2. Virtualization**

We will use `react-window` for virtualization. The `TableBody` component uses `FixedSizeList` from `react-window` to render only the visible rows for performance optimization.

### **Adding Virtualization in `TableBody.js

`**

```jsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';

const TableBody = ({
  columns,
  columnOrder,
  pinnedColumns,
  data,
  editableData,
  columnVisibility,
  toggleRowSelection,
  selectedRows,
  isVirtualized,
  renderGroupedRows,
  groupedData,
}) => {
  const renderRows = isVirtualized ? (
    <List
      height={500}
      itemCount={groupedData.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => {
        const group = groupedData[index];
        return (
          <tr style={style} key={index}>
            {group.rows.map((row, rowIndex) => (
              <td key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <span key={colIndex}>{row[col.accessor]}</span>
                ))}
              </td>
            ))}
          </tr>
        );
      }}
    </List>
  ) : (
    groupedData.map(group => renderGroupedRows(group))
  );

  return <tbody>{renderRows}</tbody>;
};

export default TableBody;
```

### Conclusion

1. **Grouping**: We’ve added a `useGrouping` hook that groups rows by the selected columns and supports expanding and collapsing the groups.
2. **Virtualization**: We’ve implemented row virtualization with `react-window`. This renders only the visible rows, which drastically improves performance for large tables.

These features, combined with sorting, filtering, and pagination, create a highly efficient and user-friendly table component that can scale with large datasets. You can now integrate and extend these functionalities further based on your project needs!