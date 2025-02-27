import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Table } from '../common/Table';

interface UserListProps {
  onUserSelect?: (user: IUser) => void;
}

export const UserList: React.FC<UserListProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: '用户名', accessor: 'username' },
    { header: '邮箱', accessor: 'email' },
    { header: '注册时间', accessor: 'createdAt' },
    { header: '状态', accessor: 'status' },
    {
      header: '操作',
      accessor: 'actions',
      cell: (user: IUser) => (
        <div className="space-x-2">
          <button 
            onClick={() => onUserSelect?.(user)}
            className="text-blue-500 hover:text-blue-700"
          >
            编辑
          </button>
          <button 
            onClick={() => handleUserDelete(user.id)}
            className="text-red-500 hover:text-red-700"
          >
            删除
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="overflow-x-auto">
      <Table 
        data={users}
        columns={columns}
        loading={loading}
      />
    </div>
  );
}; 