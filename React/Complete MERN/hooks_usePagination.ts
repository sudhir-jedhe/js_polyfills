import { useState, useMemo } from 'react';

export const usePagination = (data: any[], initialPageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  return { paginatedData, currentPage, setCurrentPage, pageSize, setPageSize };
};

