// src/admin/AdminResults.tsx
import React, { useState } from 'react';
import { Layout, Table, Button } from 'antd';
import { Sidebar } from '../components/Sidebar';
import { getResults } from "../api/uresApi";

const { Content } = Layout;

interface Result {
  id: string;
  userId: string;
  gameType: string;
  result: string;
  amount: number;
  createdAt: string;
}

export const AdminResults: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '游戏类型',
      dataIndex: 'gameType',
      key: 'gameType',
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }
  ];

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { results: fetchedResults, totalCount } = await getResults(currentPage, resultsPerPage);
      setResults(fetchedResults || []);
      setTotalCount(totalCount || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      />
      <Layout>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            <Table 
              columns={columns}
              dataSource={results}
              rowKey="id"
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminResults;