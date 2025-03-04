import React from 'react';

// Mock Button 组件
export const Button = ({ children, onClick, className }: any) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

// Mock Table 组件
export const Table = ({ dataSource, columns, loading, error }: any) => {
  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div role="img" aria-label="loading">Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns?.map((col: any) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((row: any) => (
          <tr key={row.id}>
            {columns?.map((col: any) => (
              <td key={`${row.id}-${col.key}`}>{row[col.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 