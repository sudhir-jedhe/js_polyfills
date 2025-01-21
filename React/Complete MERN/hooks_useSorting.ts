import { useState, useMemo } from 'react';

interface Column {
  accessor: string;
  Header: string;
}

export const useSorting = (data: any[], columns: Column[]) => {
  const [sortBy, setSortBy] = useState<{ column: string | null; direction: 'asc' | 'desc' }>({
    column: null,
    direction: 'asc',
  });

  const sortedData = useMemo(() => {
    if (!sortBy.column) return data;

    return [...data].sort((a, b) => {
      if (a[sortBy.column!] < b[sortBy.column!]) return sortBy.direction === 'asc' ? -1 : 1;
      if (a[sortBy.column!] > b[sortBy.column!]) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortBy]);

  return { sortedData, sortBy, setSortBy };
};

