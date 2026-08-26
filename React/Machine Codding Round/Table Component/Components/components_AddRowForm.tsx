import React, { useState } from 'react';
import { Column, RowData } from '../types';

interface AddRowFormProps {
  columns: Column[];
  onAdd: (newRow: RowData) => void;
  onCancel: () => void;
}

const AddRowForm: React.FC<AddRowFormProps> = ({ columns, onAdd, onCancel }) => {
  const [newRow, setNewRow] = useState<RowData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newRow);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {columns.map((column) => (
        <div key={column.accessor} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={column.accessor}>
            {column.Header}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={column.accessor}
            type="text"
            placeholder={column.Header}
            value={newRow[column.accessor] || ''}
            onChange={(e) => setNewRow({ ...newRow, [column.accessor]: e.target.value })}
          />
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Row
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddRowForm;

