import { useState, useCallback } from 'react';

export const useRowSelection = (data: any[]) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRowSelection = useCallback((rowIndex: number) => {
    setSelectedRows((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(rowIndex)) {
        newSelected.delete(rowIndex);
      } else {
        newSelected.add(rowIndex);
      }
      return newSelected;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.size === data.length) {
        return new Set();
      } else {
        return new Set(data.map((_, index) => index));
      }
    });
  }, [data]);

  const isAllSelected = selectedRows.size === data.length;

  return { selectedRows, toggleRowSelection, toggleAllRows, isAllSelected };
};

