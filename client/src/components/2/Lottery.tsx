import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Row, Col, Statistic, message } from 'antd';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

interface LotteryStats {
  totalDraws: number;
  totalPrizes: number;
  totalValue: number;
  conversionRate: number;
}

interface PrizeDistribution {
  name: string;
  count: number;
  value: number;
}

const { RangePicker } = DatePicker;

const AdminLottery: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [stats, setStats] = useState<LotteryStats>({
    totalDraws: 0,
    totalPrizes: 0,
    totalValue: 0,
    conversionRate: 0
  });
  const [distribution, setDistribution] = useState<PrizeDistribution[]>([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, distRes, recordsRes] = await Promise.all([
        axios.get('/api/admin/lottery/stats', {
          params: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          }
        }),
        axios.get('/api/admin/lottery/distribution', {
          params: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          }
        }),
        axios.get('/api/admin/lottery/records', {
          params: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          }
        })
      ]);

      setStats(statsRes.data);
      setDistribution(distRes.data);
      setRecords(recordsRes.data);
    } catch (error) {
      message.error('获取数据失败');
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
      title: '奖品',
      dataIndex: 'prizeName',
      key: 'prizeName',
    },
    {
      title: '价值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="总抽奖次数" value={stats.totalDraws} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="中奖次数" value={stats.totalPrizes} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="奖品总价值" value={stats.totalValue} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="中奖率" value={stats.conversionRate} suffix="%" precision={2} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={12}>
          <Card title="奖品分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="价值分布">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="价值" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="抽奖记录">
        <Table
          columns={columns}
          dataSource={records}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminLottery; 