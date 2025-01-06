import { useMemo } from 'react';
import { Column } from '../types';

export const useFiltering = (data: any[], filters: Record<string, string>, columns: Column[]) => {
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return columns.every((column) => {
        const filterValue = filters[column.accessor];
        if (!filterValue) return true;
        const cellValue = row[column.accessor];
        return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters, columns]);

  return { filteredData };
};

