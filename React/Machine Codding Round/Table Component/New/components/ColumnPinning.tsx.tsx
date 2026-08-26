import React from 'react';

interface Column {
  accessor: string;
  Header: string;
}

interface ColumnPinningProps {
  columns: Column[];
  pinnedColumns: { left: string[], right: string[] };
  onPinColumn: (columnId: string, direction: 'left' | 'right' | null) => void;
}

const ColumnPinning: React.FC<ColumnPinningProps> = ({ columns, pinnedColumns, onPinColumn }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Column Pinning</h3>
      <div className="flex flex-wrap gap-2">
        {columns.map((column) => (
          <div key={column.accessor} className="flex items-center space-x-2">
            <span>{column.Header}</span>
            <button
              onClick={() => onPinColumn(column.accessor, pinnedColumns.left.includes(column.accessor) ? null : 'left')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                pinnedColumns.left.includes(column.accessor)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pinnedColumns.left.includes(column.accessor) ? 'Unpin Left' : 'Pin Left'}
            </button>
            <button
              onClick={() => onPinColumn(column.accessor, pinnedColumns.right.includes(column.accessor) ? null : 'right')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                pinnedColumns.right.includes(column.accessor)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pinnedColumns.right.includes(column.accessor) ? 'Unpin Right' : 'Pin Right'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnPinning;

