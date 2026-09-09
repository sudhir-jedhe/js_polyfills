***  Pagination1.md ***

An accessible, production-ready React pagination component includes page numbers, dynamic ellipsis handling (`...`), previous/next navigation, and full WAI-ARIA compliance.

---

### Implementation

```tsx
import React, { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  siblingCount = 1,
  onPageChange,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // 1 + siblings + 2*dots + lastPage

    // Case 1: Total pages less than the page numbers we want to show
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Case 2: No left dots to show, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    // Case 3: No right dots to show, but left dots needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalPageCount, siblingCount, currentPage]);

  if (currentPage === 0 || totalPageCount < 2) {
    return null;
  }

  return (
    <nav aria-label="Pagination Navigation" style={{ display: 'flex', justifyContent: 'center' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '6px', padding: 0, alignItems: 'center' }}>
        {/* Previous Button */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            style={{
              padding: '6px 12px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
            }}
          >
            &laquo; Prev
          </button>
        </li>

        {/* Page Numbers and Ellipses */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li key={`dots-${index}`} aria-hidden="true" style={{ padding: '0 4px', userSelect: 'none' }}>
                &#8230;
              </li>
            );
          }

          const isCurrent = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <button
                type="button"
                onClick={() => onPageChange(pageNumber as number)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${pageNumber}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: isCurrent ? '#2563eb' : '#fff',
                  color: isCurrent ? '#fff' : '#000',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPageCount}
            aria-label="Go to next page"
            style={{
              padding: '6px 12px',
              cursor: currentPage === totalPageCount ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
            }}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

```

---

### Usage Example with Client-Side Slicing

```tsx
import React, { useState } from 'react';
import { Pagination } from './Pagination';

const dummyData = Array.from({ length: 95 }, (_, i) => `Item #${i + 1}`);
const PAGE_SIZE = 10;

export const App = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Slice data for current view
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return dummyData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <ul>
        {currentTableData.map(item => (
          <li key={item} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            {item}
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalCount={dummyData.length}
        pageSize={PAGE_SIZE}
        siblingCount={1}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  );
};

```

---

### Accessibility Checklist

* **`<nav aria-label="Pagination Navigation">`**: Informs assistive tech of the landmark region.
* **`aria-current="page"`**: Explicitly denotes the active page button.
* **`aria-label` on buttons**: Provides screen readers descriptive text (e.g., `"Go to previous page"` instead of `"«"`).
* **`aria-hidden="true"` on dots**: Prevents screen readers from announcing non-interactive ellipsis markers.
