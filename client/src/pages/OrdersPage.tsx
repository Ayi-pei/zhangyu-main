import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { getStatusColor, formatDate, formatCurrency } from '../lib/utils';

// Mock order data
const mockOrders = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    amount: 1000,
    type: 'deposit',
    status: 'completed',
    createdAt: '2023-04-10T15:30:00Z',
    updatedAt: '2023-04-10T16:00:00Z',
    bankInfo: {
      bankName: 'Bank of America',
      accountNumber: '****5678',
    },
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    amount: 500,
    type: 'withdrawal',
    status: 'pending',
    createdAt: '2023-04-11T12:15:00Z',
    updatedAt: '2023-04-11T12:15:00Z',
    bankInfo: {
      bankName: 'Chase',
      accountNumber: '****1234',
    },
  },
  {
    id: '3',
    userId: '3',
    username: 'bobsmith',
    amount: 2000,
    type: 'deposit',
    status: 'completed',
    createdAt: '2023-04-09T18:45:00Z',
    updatedAt: '2023-04-09T19:30:00Z',
    bankInfo: {
      bankName: 'Wells Fargo',
      accountNumber: '****9876',
    },
  },
  {
    id: '4',
    userId: '1',
    username: 'johndoe',
    amount: 1500,
    type: 'withdrawal',
    status: 'rejected',
    createdAt: '2023-04-08T09:20:00Z',
    updatedAt: '2023-04-08T10:15:00Z',
    bankInfo: {
      bankName: 'Bank of America',
      accountNumber: '****5678',
    },
  },
  {
    id: '5',
    userId: '4',
    username: 'alicejones',
    amount: 3000,
    type: 'deposit',
    status: 'pending',
    createdAt: '2023-04-12T14:10:00Z',
    updatedAt: '2023-04-12T14:10:00Z',
    bankInfo: {
      bankName: 'Citibank',
      accountNumber: '****4321',
    },
  },
];

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState(mockOrders);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredOrders = orders.filter(
    (order) =>
      order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'completed' | 'rejected') => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage deposit and withdrawal orders
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outline"
          leftIcon={<Filter size={16} />}
          className="sm:w-auto"
        >
          Filter
        </Button>
      </div>
      
      {/* Orders table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.username}
                    </div>
                    <div className="text-sm text-gray-500">ID: {order.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                            onClick={() => handleStatusChange(order.id, 'completed')}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                            onClick={() => handleStatusChange(order.id, 'rejected')}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredOrders.length}</span> of{' '}
                <span className="font-medium">{filteredOrders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;