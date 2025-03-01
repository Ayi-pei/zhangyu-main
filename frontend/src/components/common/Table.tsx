import { Spin } from 'antd';
import { TableColumn } from '../../types';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
}

export const Table = <T extends {}>({ data, columns, loading }: TableProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spin />
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {column.cell
                  ? column.cell(item)
                  : (item as any)[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 