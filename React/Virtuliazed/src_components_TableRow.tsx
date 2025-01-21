import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Column, RowData } from '../types';

interface TableRowProps {
  row: RowData;
  columns: Column[];
  columnWidths: { [key: string]: number };
  isSelected: boolean;
  onToggleSelect: () => void;
  style?: React.CSSProperties;
  provided?: any;
  isDragging?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  columnWidths,
  isSelected,
  onToggleSelect,
  style,
  provided,
  isDragging,
}) => {
  return (
    <Draggable draggableId={row.id.toString()} index={row.id - 1}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`table-row ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{ ...style, ...provided.draggableProps.style }}
        >
          <div className="row-cell checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
            />
          </div>
          {columns.map((column) => (
            <div
              key={column.accessor}
              className="row-cell"
              style={{ width: columnWidths[column.accessor] }}
            >
              {row[column.accessor]}
            </div>
          ))}
        </div>
      )}
    </Draggable>
  );
};

export default TableRow;

