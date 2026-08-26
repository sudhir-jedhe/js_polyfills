import React from 'react';
import { Column } from '../types';

interface TableHeaderProps {
  columns: Column[];
  columnWidths: { [key: string]: number };
  onResizeColumn: (columnId: string, width: number) => void;
  sortBy: { column: string | null; direction: 'asc' | 'desc' };
  onSort: (sort: { column: string; direction: 'asc' | 'desc' }) => void;
  filters: { [key: string]: string };
  onFilterChange: (filters: { [key: string]: string }) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnWidths,
  onResizeColumn,
  sortBy,
  onSort,
  filters,
  onFilterChange,
  onSelectAll,
  isAllSelected,
}) => {
  const handleResizeMouseDown = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = columnWidths[columnId];

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.pageX - startX;
      onResizeColumn(columnId, startWidth + diff);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="table-header">
      <div className="header-row">
        <div className="header-cell checkbox">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
          />
        </div>
        {columns.map((column) => (
          <div
            key={column.accessor}
            className="header-cell"
            style={{ width: columnWidths[column.accessor] }}
          >
            <div className="cell-content">
              <span onClick={() => onSort({ column: column.accessor, direction: sortBy.column === column.accessor && sortBy.direction === 'asc' ? 'desc' : 'asc' })}>
                {column.Header}
                {sortBy.column === column.accessor && (
                  <span className="sort-indicator">{sortBy.direction === 'asc' ? '▲' : '▼'}</span>
                )}
              </span>
              <input
                type="text"
                value={filters[column.accessor] || ''}
                onChange={(e) => onFilterChange({ ...filters, [column.accessor]: e.target.value })}
                placeholder="Filter..."
              />
            </div>
            <div
              className="resize-handle"
              onMouseDown={(e) => handleResizeMouseDown(e, column.accessor)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;

