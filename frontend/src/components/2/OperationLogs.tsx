import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, Input, Button, Space } from 'antd';
import { Search, Download } from 'lucide-react';
import { adminAPI } from '../../services/api';
import * as XLSX from 'xlsx';

interface OperationLog {
  id: string;
  operator: string;
  action: string;
  type: string;
  targetId: string;
  details: string;
  ip: string;
  createdAt: string;
}

export const OperationLogs: React.FC = () => {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    type: '',
    operator: '',
    keyword: ''
  });

  const columns = [
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '操作行为',
      dataIndex: 'action',
      key: 'action'
    },
    {
      title: '目标ID',
      dataIndex: 'targetId',
      key: 'targetId'
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    }
  ];

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getOperationLogs(filters);
      setLogs(response.data);
    } catch (error) {
      console.error('获取操作日志失败:', error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    const exportData = logs.map(log => ({
      操作人: log.operator,
      操作类型: log.type,
      操作行为: log.action,
      目标ID: log.targetId,
      详情: log.details,
      IP地址: log.ip,
      操作时间: new Date(log.createdAt).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '操作日志');
    XLSX.writeFile(wb, `操作日志_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="operation-logs">
      <div className="filters mb-4">
        <Space size="middle">
          <DatePicker.RangePicker
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
          />
          <Select
            style={{ width: 120 }}
            placeholder="操作类型"
            allowClear
            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          >
            <Select.Option value="user">用户管理</Select.Option>
            <Select.Option value="game">游戏管理</Select.Option>
            <Select.Option value="approval">审批操作</Select.Option>
            <Select.Option value="system">系统设置</Select.Option>
          </Select>
          <Input
            placeholder="操作人"
            style={{ width: 150 }}
            onChange={(e) => setFilters(prev => ({ ...prev, operator: e.target.value }))}
          />
          <Input
            placeholder="关键词搜索"
            style={{ width: 200 }}
            prefix={<Search size={16} />}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
          <Button
            type="primary"
            icon={<Download size={16} />}
            onClick={handleExport}
          >
            导出日志
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        loading={loading}
        rowKey="id"
        pagination={{
          total: logs.length,
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />
    </div>
  );
}; 