import React, { useState, useEffect, useMemo } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import { useSorting } from '../hooks/useSorting';
import { usePagination } from '../hooks/usePagination';
import { useFiltering } from '../hooks/useFiltering';
import { useEditableData } from '../hooks/useEditableData';
import { useRowSelection } from '../hooks/useRowSelection';
import { useGrouping } from '../hooks/useGrouping';
import { fuzzySearch } from '../utils/fuzzySearch';
import ColumnPinning from './ColumnPinning';
import ColumnOrdering from './ColumnOrdering';
import ColumnVisibility from './ColumnVisibility';
import AddRowForm from './AddRowForm';
import { Column, TableProps, RowData } from '../types';

const Table: React.FC<TableProps> = ({
  columns,
  data,
  pageSize = 10,
  groupByColumns = [],
  isVirtualized = false,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.accessor));
  const [pinnedColumns, setPinnedColumns] = useState<{ left: string[], right: string[] }>({ left: [], right: [] });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.accessor]: true }), {})
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const { sortedData, sortBy, setSortBy } = useSorting(tableData, columns);
  const { paginatedData, currentPage, setCurrentPage, setPageSize } = usePagination(sortedData, pageSize);
  const { filteredData, setFilters: setGlobalFilters } = useFiltering(paginatedData, filters, columns);
  const { groupedData, renderGroupedRows } = useGrouping(filteredData, columns, groupByColumns);
  const { editableData, updateEditableData } = useEditableData(filteredData);
  const { selectedRows, toggleRowSelection, toggleAllRows, isAllSelected } = useRowSelection(filteredData);

  const fuzzySearchData = useMemo(() => {
    if (filters?.search) {
      return fuzzySearch(filteredData, filters.search, columns.map(col => col.accessor));
    }
    return filteredData;
  }, [filters, filteredData, columns]);

  const handlePinColumn = (columnId: string, direction: 'left' | 'right' | null) => {
    setPinnedColumns(prev => {
      const newPinned = { ...prev };
      if (direction === 'left') {
        newPinned.left = [...newPinned.left, columnId];
        newPinned.right = newPinned.right.filter(id => id !== columnId);
      } else if (direction === 'right') {
        newPinned.right = [...newPinned.right, columnId];
        newPinned.left = newPinned.left.filter(id => id !== columnId);
      } else {
        newPinned.left = newPinned.left.filter(id => id !== columnId);
        newPinned.right = newPinned.right.filter(id => id !== columnId);
      }
      return newPinned;
    });
  };

  const handleColumnVisibility = (columnId: string, isVisible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  const handleAddRow = (newRow: RowData) => {
    if (onAdd) {
      onAdd(newRow);
    }
    setTableData(prev => [...prev, newRow]);
    setShowAddForm(false);
  };

  const handleUpdateRow = (updatedRow: RowData) => {
    if (onUpdate) {
      onUpdate(updatedRow);
    }
    setTableData(prev => prev.map(row => row.id === updatedRow.id ? updatedRow : row));
  };

  const handleDeleteRow = (rowToDelete: RowData) => {
    if (onDelete) {
      onDelete(rowToDelete);
    }
    setTableData(prev => prev.filter(row => row.id !== rowToDelete.id));
  };

  const visibleColumns = columns.filter(col => columnVisibility[col.accessor]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        <ColumnPinning
          columns={columns}
          pinnedColumns={pinnedColumns}
          onPinColumn={handlePinColumn}
        />
        <ColumnOrdering
          columns={visibleColumns}
          columnOrder={columnOrder}
          onColumnOrderChange={setColumnOrder}
        />
        <ColumnVisibility
          columns={columns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibility}
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Row
        </button>
      </div>
      {showAddForm && (
        <AddRowForm
          columns={columns}
          onAdd={handleAddRow}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={visibleColumns}
            columnOrder={columnOrder}
            pinnedColumns={pinnedColumns}
            onSort={setSortBy}
            onPinColumn={handlePinColumn}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibility}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            onSelectAll={toggleAllRows}
            isAllSelected={isAllSelected}
          />
          <TableBody
            columns={visibleColumns}
            columnOrder={columnOrder.filter(colId => columnVisibility[colId])}
            pinnedColumns={pinnedColumns}
            data={fuzzySearchData}
            editableData={editableData}
            columnVisibility={columnVisibility}
            toggleRowSelection={toggleRowSelection}
            selectedRows={selectedRows}
            isVirtualized={isVirtualized}
            renderGroupedRows={renderGroupedRows}
            groupedData={groupedData}
            filters={filters}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
          />
        </table>
      </div>
      <Pagination
        totalItems={fuzzySearchData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setCurrentPage}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default Table;

