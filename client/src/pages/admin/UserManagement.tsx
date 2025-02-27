import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, message } from 'antd';
import { Edit2, Trash2, Search, RefreshCw, ExportOutlined } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { adminAPI } from '../../services/api';
import * as XLSX from 'xlsx';

interface UserData {
  id: string;
  username: string;
  email: string;
  creditScore: number;
  level: number;
  status: string;
  createdAt: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const [selectedRows, setSelectedRows] = useState<UserData[]>([]);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '信誉分',
      dataIndex: 'creditScore',
      key: 'creditScore',
      render: (score: number) => (
        <span style={{ color: score >= 90 ? colors.success : score >= 70 ? colors.warning : colors.error }}>
          {score}
        </span>
      )
    },
    {
      title: '会员等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: number) => ['灰星', '金星1', '金星2', '金星3'][level - 1]
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === 'active' ? colors.success : colors.error 
        }}>
          {status === 'active' ? '正常' : '禁用'}
        </span>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserData) => (
        <div className="flex gap-2">
          <Button 
            icon={<Edit2 size={16} />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户列表失败');
    }
    setLoading(false);
  };

  const handleEdit = (user: UserData) => {
    // 实现编辑逻辑
  };

  const handleDelete = async (id: string) => {
    try {
      await adminAPI.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleBatchOperation = async (operation: 'delete' | 'disable' | 'enable') => {
    const ids = selectedRows.map(row => row.id);
    try {
      switch (operation) {
        case 'delete':
          await adminAPI.batchDeleteUsers(ids);
          message.success('批量删除成功');
          break;
        case 'disable':
          await adminAPI.batchUpdateUsers(ids, { status: 'disabled' });
          message.success('批量禁用成功');
          break;
        case 'enable':
          await adminAPI.batchUpdateUsers(ids, { status: 'active' });
          message.success('批量启用成功');
          break;
      }
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleExport = () => {
    const exportData = users.map(user => ({
      用户名: user.username,
      邮箱: user.email,
      信誉分: user.creditScore,
      会员等级: ['灰星', '金星1', '金星2', '金星3'][user.level - 1],
      状态: user.status === 'active' ? '正常' : '禁用',
      注册时间: new Date(user.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '用户数据');
    XLSX.writeFile(wb, `用户数据_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="user-management">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="搜索用户..."
            prefix={<Search size={16} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="会员等级"
            style={{ width: 120 }}
          >
            <Select.Option value="1">灰星</Select.Option>
            <Select.Option value="2">金星1</Select.Option>
            <Select.Option value="3">金星2</Select.Option>
            <Select.Option value="4">金星3</Select.Option>
          </Select>
          <Select
            placeholder="用户状态"
            style={{ width: 120 }}
          >
            <Select.Option value="active">正常</Select.Option>
            <Select.Option value="disabled">禁用</Select.Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            danger
            disabled={selectedRows.length === 0}
            onClick={() => handleBatchOperation('delete')}
          >
            批量删除
          </Button>
          <Button
            disabled={selectedRows.length === 0}
            onClick={() => handleBatchOperation('disable')}
          >
            批量禁用
          </Button>
          <Button
            disabled={selectedRows.length === 0}
            onClick={() => handleBatchOperation('enable')}
          >
            批量启用
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出数据
          </Button>
          <Button
            icon={<RefreshCw size={16} />}
            onClick={fetchUsers}
          >
            刷新
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          onChange: (_, selectedRows) => setSelectedRows(selectedRows)
        }}
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />
    </div>
  );
}; 