import { useMemo } from 'react';

interface Column {
  accessor: string;
  Header: string;
}

export const useGrouping = (data: any[], columns: Column[], groupByColumns: string[]) => {
  const groupedData = useMemo(() => {
    if (groupByColumns.length === 0) return data.map(row => ({ groupKey: '', rows: [row] }));

    const groups: Record<string, any[]> = {};
    data.forEach(row => {
      const groupKey = groupByColumns.map(col => row[col]).join('-');
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });

    return Object.entries(groups).map(([groupKey, rows]) => ({ groupKey, rows }));
  }, [data, groupByColumns]);

  const renderGroupedRows = (group: { groupKey: string; rows: any[] }) => {
    return (
      <React.Fragment key={group.groupKey}>
        <tr className="bg-gray-100">
          <td colSpan={columns.length} className="px-6 py-4 font-medium">
            {group.groupKey || 'Ungrouped'}
          </td>
        </tr>
        {group.rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            {columns.map(column => (
              <td key={column.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </React.Fragment>
    );
  };

  return { groupedData, renderGroupedRows };
};

