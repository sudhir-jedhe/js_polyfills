export interface Column {
  accessor: string;
  Header: string;
  width: number;
}

export interface RowData {
  [key: string]: any;
  id: number;
}

