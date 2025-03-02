import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Table } from '../../test/mocks/components';
import { vi } from 'vitest';

vi.mock('antd', () => ({
  Table: (props: any) => Table(props)
}));

describe('Table Component', () => {
  const mockData = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  it('renders table with data', () => {
    render(<Table dataSource={mockData} columns={columns} />);
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Error loading data';
    render(<Table error={errorMessage} columns={columns} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    render(<Table loading columns={columns} />);
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
  });
}); 