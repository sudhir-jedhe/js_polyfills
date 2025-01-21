import React, { useState, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Column, RowData } from '../types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';
import { useTableState } from '../hooks/useTableState';

interface AdvancedTableProps {
  columns: Column[];
  data: RowData[];
}

const AdvancedTable: React.FC<AdvancedTableProps> = ({ columns, data }) => {
  const {
    sortedData,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    isAllSelected,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useTableState(data);

  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    columns.reduce((acc, column) => ({ ...acc, [column.accessor]: column.width }), {})
  );

  const handleResizeColumn = useCallback((columnId: string, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [columnId]: width }));
  }, []);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const newData = Array.from(sortedData);
    const [reorderedItem] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, reorderedItem);

    // Update the data order in your state management solution here
  }, [sortedData]);

  const listRef = useRef<List>(null);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <TableRow
      row={sortedData[index]}
      columns={columns}
      columnWidths={columnWidths}
      isSelected={selectedRows.has(index)}
      onToggleSelect={() => toggleRowSelection(index)}
      style={style}
    />
  );

  const getAllRecords = useCallback(() => {
    // Return all records based on current filters, sorting, and selection
    return sortedData.filter((_, index) => selectedRows.has(index));
  }, [sortedData, selectedRows]);

  return (
    <div className="advanced-table">
      <TableHeader
        columns={columns}
        columnWidths={columnWidths}
        onResizeColumn={handleResizeColumn}
        sortBy={sortBy}
        onSort={setSortBy}
        filters={filters}
        onFilterChange={setFilters}
        onSelectAll={toggleAllRows}
        isAllSelected={isAllSelected}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table-body" mode="virtual" renderClone={(provided, snapshot, rubric) => (
          <TableRow
            row={sortedData[rubric.source.index]}
            columns={columns}
            columnWidths={columnWidths}
            isSelected={selectedRows.has(rubric.source.index)}
            onToggleSelect={() => {}}
            provided={provided}
            isDragging={snapshot.isDragging}
          />
        )}>
          {(provided) => (
            <List
              ref={listRef}
              height={400}
              itemCount={sortedData.length}
              itemSize={35}
              width="100%"
              outerRef={provided.innerRef}
            >
              {Row}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Pagination
        totalItems={sortedData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
      <button onClick={() => console.log(getAllRecords())}>Get Selected Records</button>
    </div>
  );
};

export default AdvancedTable;

