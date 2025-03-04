import React from 'react';
import { Table as AntTable } from 'antd';
import type { TableProps } from 'antd';

export interface CustomTableProps<T> extends TableProps<T> {
  loading?: boolean;
  error?: string;
  columns: Array<{
    title: string;
    dataIndex: keyof T;
    key: string;
    render?: (text: any, record: T) => React.ReactNode;
  }>;
}

export const Table = <T extends object>({ 
  loading,
  error,
  columns,
  ...props 
}: CustomTableProps<T>) => {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <AntTable<T>
      loading={loading}
      columns={columns}
      {...props}
      className="w-full"
    />
  );
};

export default Table; 