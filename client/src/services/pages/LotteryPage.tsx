import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import { getStatusColor, formatDate } from '../lib/utils';

// Mock lottery data
const mockLotteryResults = [
  {
    id: '1',
    drawNumber: 'LT-20230410-001',
    drawDate: '2023-04-10T20:00:00Z',
    numbers: ['07', '15', '23', '32', '41', '48'],
    createdAt: '2023-04-10T20:15:00Z',
    status: 'published',
  },
  {
    id: '2',
    drawNumber: 'LT-20230411-001',
    drawDate: '2023-04-11T20:00:00Z',
    numbers: ['03', '12', '24', '35', '42', '49'],
    createdAt: '2023-04-11T20:15:00Z',
    status: 'published',
  },
  {
    id: '3',
    drawNumber: 'LT-20230412-001',
    drawDate: '2023-04-12T20:00:00Z',
    numbers: ['05', '18', '27', '36', '44', '50'],
    createdAt: '2023-04-12T20:15:00Z',
    status: 'published',
  },
  {
    id: '4',
    drawNumber: 'LT-20230413-001',
    drawDate: '2023-04-13T20:00:00Z',
    numbers: ['02', '11', '22', '33', '44', '55'],
    createdAt: '2023-04-13T20:15:00Z',
    status: 'published',
  },
  {
    id: '5',
    drawNumber: 'LT-20230414-001',
    drawDate: '2023-04-14T20:00:00Z',
    numbers: [],
    createdAt: '2023-04-14T15:00:00Z',
    status: 'pending',
  },
];

const LotteryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lotteryResults, setLotteryResults] = useState(mockLotteryResults);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredResults = lotteryResults.filter(
    (result) =>
      result.drawNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePublish = (resultId: string, numbers: string[]) => {
    if (numbers.length === 0) {
      // Generate random numbers for the lottery
      const randomNumbers = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 59 + 1)
          .toString()
          .padStart(2, '0')
      ).sort((a, b) => parseInt(a) - parseInt(b));
      
      setLotteryResults(
        lotteryResults.map((result) =>
          result.id === resultId
            ? { ...result, numbers: randomNumbers, status: 'published' }
            : result
        )
      );
    } else {
      setLotteryResults(
        lotteryResults.map((result) =>
          result.id === resultId ? { ...result, status: 'published' } : result
        )
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lottery Results</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage lottery draws and results
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Add New Draw</Button>
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
            placeholder="Search draws..."
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
      
      {/* Lottery results table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Draw Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Draw Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numbers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.drawNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(result.drawDate, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {result.numbers.length > 0 ? (
                        result.numbers.map((number, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 text-xs font-medium"
                          >
                            {number}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Not drawn yet</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(result.createdAt, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {result.status === 'pending' && (
                        <>
                          <button
                            className="text-secondary-600 hover:text-secondary-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handlePublish(result.id, result.numbers)}
                          >
                            Publish
                          </Button>
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
                <span className="font-medium">{filteredResults.length}</span> of{' '}
                <span className="font-medium">{filteredResults.length}</span> results
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

export default LotteryPage;