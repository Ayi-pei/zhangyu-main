import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Users, Activity, TrendingUp, Award } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { adminAPI } from '../../services/api';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalRevenue: number;
  userTrend: Array<{
    date: string;
    count: number;
  }>;
  gameTrend: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  userLevels: Array<{
    level: string;
    count: number;
  }>;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardData();
      setData(response.data);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data || loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="dashboard">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={data.totalUsers}
              prefix={<Users size={20} />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={data.activeUsers}
              prefix={<Activity size={20} />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总游戏数"
              value={data.totalGames}
              prefix={<TrendingUp size={20} />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={data.totalRevenue}
              prefix="¥"
              valueStyle={{ color: colors.error }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="用户增长趋势">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.userTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={colors.primary} 
                  name="新增用户"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户等级分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.userLevels}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={colors.primary}
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="游戏数据趋势">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.gameTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="count" 
                  fill={colors.primary} 
                  name="游戏场次"
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="revenue" 
                  fill={colors.success} 
                  name="收入"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 