import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit,
  Lock, 
  Unlock,
  MoreHorizontal
} from 'lucide-react';
import Button from '../components/ui/Button';
import { getStatusColor, formatDate } from '../lib/utils';

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    balance: 1500,
    points: 250,
    memberLevel: 2,
    creditScore: 85,
    status: 'active',
    createdAt: '2023-01-15T10:30:00Z',
    lastLogin: '2023-04-10T15:45:00Z',
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    role: 'user',
    balance: 2500,
    points: 450,
    memberLevel: 3,
    creditScore: 92,
    status: 'active',
    createdAt: '2023-02-20T09:15:00Z',
    lastLogin: '2023-04-12T11:30:00Z',
  },
  {
    id: '3',
    username: 'bobsmith',
    email: 'bob@example.com',
    role: 'user',
    balance: 500,
    points: 100,
    memberLevel: 1,
    creditScore: 70,
    status: 'frozen',
    createdAt: '2023-03-05T14:20:00Z',
    lastLogin: '2023-03-25T16:10:00Z',
  },
  {
    id: '4',
    username: 'alicejones',
    email: 'alice@example.com',
    role: 'admin',
    balance: 5000,
    points: 1200,
    memberLevel: 5,
    creditScore: 98,
    status: 'active',
    createdAt: '2022-11-10T08:45:00Z',
    lastLogin: '2023-04-14T09:20:00Z',
  },
  {
    id: '5',
    username: 'mikebrown',
    email: 'mike@example.com',
    role: 'user',
    balance: 0,
    points: 50,
    memberLevel: 1,
    creditScore: 60,
    status: 'deleted',
    createdAt: '2023-01-30T11:50:00Z',
    lastLogin: '2023-02-15T13:40:00Z',
  },
];

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusChange = (userId: string, newStatus: 'active' | 'frozen' | 'deleted') => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        <Button leftIcon={<UserPlus size={16} />}>Add User</Button>
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
            placeholder="Search users..."
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
      
      {/* Users table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Level {user.memberLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Freeze"
                          onClick={() => handleStatusChange(user.id, 'frozen')}
                        >
                          <Lock size={16} />
                        </button>
                      ) : user.status === 'frozen' ? (
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Unfreeze"
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <Unlock size={16} />
                        </button>
                      ) : null}
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="More options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
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
                <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
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

export default UsersPage;