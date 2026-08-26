import React from 'react';
import { Column } from '../types';

interface ColumnVisibilityProps {
  columns: Column[];
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
}

const ColumnVisibility: React.FC<ColumnVisibilityProps> = ({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Column Visibility</h3>
      <div className="flex flex-wrap gap-2">
        {columns.map((column) => (
          <div key={column.accessor} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`visibility-${column.accessor}`}
              checked={columnVisibility[column.accessor]}
              onChange={(e) => onColumnVisibilityChange(column.accessor, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label htmlFor={`visibility-${column.accessor}`} className="text-sm font-medium text-gray-700">
              {column.Header}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnVisibility;

