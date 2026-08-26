import React from 'react';

interface ColumnFilterProps {
  column: { accessor: string; Header: string };
  filterValue: string;
  onChange: (value: string) => void;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ column, filterValue, onChange }) => {
  return (
    <input
      type="text"
      value={filterValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Filter ${column.Header}`}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
    />
  );
};

export default ColumnFilter;

