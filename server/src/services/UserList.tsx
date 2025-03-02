import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api';
import { Table } from '../../../../client/src/components/common/Table';
import { IUser, TableColumn } from '../../../../client/src/types';
import { message } from 'antd';

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
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
    }
  };

  const columns: TableColumn<IUser>[] = [
    { header: '用户名', accessor: 'username' },
    { header: '邮箱', accessor: 'email' },
    { header: '注册时间', accessor: 'createdAt' },
    { header: '状态', accessor: 'status' },
    {
      header: '操作',
      accessor: 'id',
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