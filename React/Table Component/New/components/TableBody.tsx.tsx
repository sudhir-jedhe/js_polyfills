import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Column, RowData } from '../types';

interface TableBodyProps {
  columns: Column[];
  columnOrder: string[];
  pinnedColumns: { left: string[], right: string[] };
  data: RowData[];
  editableData: RowData[];
  columnVisibility: Record<string, boolean>;
  toggleRowSelection: (rowIndex: number) => void;
  selectedRows: Set<number>;
  isVirtualized: boolean;
  renderGroupedRows: (group: any) => React.ReactNode;
  groupedData: any[];
  filters: Record<string, string>;
  onUpdateRow: (updatedRow: RowData) => void;
  onDeleteRow: (rowToDelete: RowData) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
  columns,
  columnOrder,
  pinnedColumns,
  data,
  editableData,
  columnVisibility,
  toggleRowSelection,
  selectedRows,
  isVirtualized,
  renderGroupedRows,
  groupedData,
  filters,
  onUpdateRow,
  onDeleteRow,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = data[index];
    const isSelected = selectedRows.has(index);
    const isEditing = editingRow === index;

    return (
      <tr
        key={index}
        style={style}
        className={`${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        } ${
          isSelected ? 'bg-blue-100' : ''
        } hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleRowSelection(index)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </td>
        {columnOrder.map((columnId) => {
          const column = columns.find(c => c.accessor === columnId);
          if (!column || !columnVisibility[columnId]) return null;
          const isPinnedLeft = pinnedColumns.left.includes(columnId);
          const isPinnedRight = pinnedColumns.right.includes(columnId);
          const cellValue = row[column.accessor];
          const filterValue = filters[column.accessor];
          
          if (filterValue && !cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())) {
            return null;
          }
          
          return (
            <td
              key={columnId}
              className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                isPinnedLeft ? 'sticky left-0 z-10 bg-inherit' : ''
              } ${isPinnedRight ? 'sticky right-0 z-10 bg-inherit' : ''}`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={cellValue}
                  onChange={(e) => {
                    const updatedRow = { ...row, [column.accessor]: e.target.value };
                    onUpdateRow(updatedRow);
                  }}
                  className="w-full p-1 border rounded"
                />
              ) : (
                cellValue
              )}
            </td>
          );
        })}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          {isEditing ? (
            <>
              <button
                onClick={() => setEditingRow(null)}
                className="text-green-600 hover:text-green-900 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingRow(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingRow(index)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteRow(row)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  const renderRows = isVirtualized ? (
    <List
      height={500}
      itemCount={data.length}
      itemSize={35}
      width="100%"
    >
      {renderRow}
    </List>
  ) : (
    data.map((row, index) => renderRow({ index, style: {} }))
  );

  return <tbody className="bg-white divide-y divide-gray-200">{renderRows}</tbody>;
};

export default TableBody;

