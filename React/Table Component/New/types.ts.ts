export interface Column {
  accessor: string;
  Header: string;
}

export interface TableProps {
  columns: Column[];
  data: any[];
  pageSize?: number;
  groupByColumns?: string[];
  isVirtualized?: boolean;
  onAdd?: (newRow: any) => void;
  onUpdate?: (updatedRow: any) => void;
  onDelete?: (rowToDelete: any) => void;
}

export interface RowData {
  [key: string]: any;
}

