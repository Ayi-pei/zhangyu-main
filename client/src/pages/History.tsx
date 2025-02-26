// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/History.tsx

import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Spin } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { betAPI } from '../utils/api';

const { Title } = Typography;

interface BetRecord {
  id: string;
  direction: 'left' | 'right';
  steps: number;
  result: string;
  pointsEarned: number;
  timestamp: string;
}

const History: React.FC = () => {
  const [records, setRecords] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchBetHistory(currentPage);
  }, [currentPage]);

  const fetchBetHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await betAPI.getBetHistory(page, pageSize);
      setRecords(response.data.records);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching bet history:', error);
      message.error('Failed to load bet history');
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    // ... (columns definition remains the same as in the previous version)
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Bet History</Title>
      <Spin spinning={loading}>
        <Table 
          dataSource={records} 
          columns={columns} 
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </Spin>
    </div>
  );
};

export default History;
