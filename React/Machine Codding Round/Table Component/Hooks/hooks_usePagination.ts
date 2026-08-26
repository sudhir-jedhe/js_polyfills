import { useState, useMemo } from 'react';

export const usePagination = (data: any[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  return { paginatedData, currentPage, setCurrentPage };
};

