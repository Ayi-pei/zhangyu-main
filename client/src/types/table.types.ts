import type { TableProps } from 'antd';

export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (text: any, record: T) => React.ReactNode;
  sorter?: boolean;
  width?: number | string;
  fixed?: 'left' | 'right';
}

export interface CustomTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
} 