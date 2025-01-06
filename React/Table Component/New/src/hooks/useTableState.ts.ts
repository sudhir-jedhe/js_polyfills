import { useState, useMemo } from 'react';
import { RowData } from '../types';

export const useTableState = (initialData: RowData[]) => {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortBy, setSortBy] = useState<{ column: string | null; direction: 'asc' | 'desc' }>({ column: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      result = result.filter((item) =>
        item[key].toString().toLowerCase().includes(value.toLowerCase())
      );
    });

    // Apply sorting
    if (sortBy.column) {
      result.sort((a, b) => {
        if (a[sortBy.column!] < b[sortBy.column!]) return sortBy.direction === 'asc' ? -1 : 1;
        if (a[sortBy.column!] > b[sortBy.column!]) return sortBy.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortBy]);

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) => {
      if (prev.size === sortedData.length) {
        return new Set();
      } else {
        return new Set(sortedData.map((_, index) => index));
      }
    });
  };

  const isAllSelected = selectedRows.size === sortedData.length;

  return {
    sortedData,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    isAllSelected,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  };
};

