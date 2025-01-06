import React from 'react';
import ColumnFilter from './ColumnFilter';
import { Column } from '../types';

interface TableHeaderProps {
  columns: Column[];
  columnOrder: string[];
  pinnedColumns: { left: string[], right: string[] };
  onSort: (sort: { column: string, direction: 'asc' | 'desc' }) => void;
  onPinColumn: (columnId: string, direction: 'left' | 'right' | null) => void;
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  sortBy: { column: string | null, direction: 'asc' | 'desc' };
  onSelectAll: () => void;
  isAllSelected: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnOrder,
  pinnedColumns,
  onSort,
  onPinColumn,
  columnVisibility,
  onColumnVisibilityChange,
  filters,
  setFilters,
  sortBy,
  onSelectAll,
  isAllSelected,
}) => {
  const handleSort = (column: string) => {
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
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </th>
        {columnOrder.map((columnId) => {
          const column = columns.find(c => c.accessor === columnId);
          if (!column || !columnVisibility[columnId]) return null;
          const isPinnedLeft = pinnedColumns.left.includes(columnId);
          const isPinnedRight = pinnedColumns.right.includes(columnId);

          return (
            <th
              key={columnId}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                isPinnedLeft ? 'sticky left-0 z-10 bg-gray-50' : ''
              } ${isPinnedRight ? 'sticky right-0 z-10 bg-gray-50' : ''}`}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSort(column.accessor)}
                    className="group flex items-center space-x-1 focus:outline-none"
                  >
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                      {column.Header}
                    </span>
                    {sortBy.column === column.accessor && (
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sortBy.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPinColumn(columnId, isPinnedLeft ? null : 'left')}
                      className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {isPinnedLeft ? 'Unpin' : 'Pin Left'}
                    </button>
                    <button
                      onClick={() => onPinColumn(columnId, isPinnedRight ? null : 'right')}
                      className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {isPinnedRight ? 'Unpin' : 'Pin Right'}
                    </button>
                  </div>
                </div>
                <ColumnFilter
                  column={column}
                  filterValue={filters[column.accessor] || ''}
                  onChange={(value) => setFilters(prev => ({ ...prev, [column.accessor]: value }))}
                />
              </div>
            </th>
          );
        })}
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;

