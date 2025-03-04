import React, { useState } from 'react';
import { SearchOutlined, FilterOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from '../components/ui/Button';
import { getStatusColor, formatDate, formatCurrency } from '../lib/utils';

// Mock bet data
const mockBets = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    amount: 100,
    type: 'Sports',
    status: 'pending',
    createdAt: '2023-04-10T15:30:00Z',
    gameId: 'game123',
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    amount: 50,
    type: 'Casino',
    status: 'won',
    createdAt: '2023-04-09T12:15:00Z',
    gameId: 'game456',
    result: 'Win $100',
  },
  {
    id: '3',
    userId: '3',
    username: 'bobsmith',
    amount: 200,
    type: 'Lottery',
    status: 'lost',
    createdAt: '2023-04-08T18:45:00Z',
    gameId: 'game789',
    result: 'No match',
  },
  {
    id: '4',
    userId: '1',
    username: 'johndoe',
    amount: 75,
    type: 'Sports',
    status: 'pending',
    createdAt: '2023-04-11T09:20:00Z',
    gameId: 'game321',
  },
  {
    id: '5',
    userId: '4',
    username: 'alicejones',
    amount: 150,
    type: 'Casino',
    status: 'cancelled',
    createdAt: '2023-04-07T14:10:00Z',
    gameId: 'game654',
  },
];

const BetsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bets, setBets] = useState(mockBets);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredBets = bets.filter(
    (bet) =>
      bet.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusChange = (betId: string, newStatus: 'pending' | 'won' | 'lost' | 'cancelled') => {
    setBets(
      bets.map((bet) =>
        bet.id === betId ? { ...bet, status: newStatus } : bet
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage betting records and results
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchOutlined />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search bets..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outline"
          leftIcon={<FilterOutlined />}
          className="sm:w-auto"
        >
          Filter
        </Button>
      </div>
      
      {/* Bets table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
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
              {filteredBets.map((bet) => (
                <tr key={bet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{bet.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bet.username}
                    </div>
                    <div className="text-sm text-gray-500">ID: {bet.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(bet.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {bet.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(bet.createdAt, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <EyeOutlined />
                      </button>
                      {bet.status === 'pending' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Won"
                            onClick={() => handleStatusChange(bet.id, 'won')}
                          >
                            <CheckOutlined />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Bet"
                            onClick={() => handleStatusChange(bet.id, 'cancelled')}
                          >
                            <CloseOutlined />
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
                <span className="font-medium">{filteredBets.length}</span> of{' '}
                <span className="font-medium">{filteredBets.length}</span> results
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

export default BetsPage;