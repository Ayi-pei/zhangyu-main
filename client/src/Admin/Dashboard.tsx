import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { UserOutlined, DollarOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

interface DashboardStats {
  totalUsers: number;
  totalBets: number;
  totalPrizes: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBets: 0,
    totalPrizes: 0,
    revenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/recent-activities')
      ]);
      
      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    }
  ];

  return (
    <div className="p-6">
      <Title level={2}>管理员仪表盘</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总投注数"
              value={stats.totalBets}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发放奖品"
              value={stats.totalPrizes}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={stats.revenue}
              prefix="¥"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近活动" className="mt-6">
        <Table
          columns={columns}
          dataSource={recentActivities}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 