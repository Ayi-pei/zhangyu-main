// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Statistic, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import BottomNav from '../components/BottomNav';

interface GameMode {
  id: string;
  name: string;
  duration: number;
  description: string;
}

interface HistoryRecord {
  id: string;
  period: string;
  result: number;
  timestamp: string;
}

const gameModes: GameMode[] = [
  { id: '3min', name: "3分模式", duration: 3, description: "快速游戏,3分钟开奖" },
  { id: '5min', name: "5分模式", duration: 5, description: "标准游戏,5分钟开奖" },
  { id: '10min', name: "10分模式", duration: 10, description: "进阶游戏,10分钟开奖" },
];

export const Home: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [statistics, setStatistics] = useState({
    totalGames: 0,
    winRate: 0,
    maxWinStreak: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await axios.get('/api/game/history');
      setHistoryData(response.data.records);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('获取历史数据失败:', error);
    }
  };

  const columns = [
    {
      title: '期号',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '开奖结果',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: '开奖时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* 游戏模式选择 */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">选择游戏模式</h2>
        <Row gutter={[16, 16]}>
          {gameModes.map((mode) => (
            <Col key={mode.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                onClick={() => navigate(`/betting/${mode.id}`)}
                className="text-center"
              >
                <Statistic title={mode.name} value={mode.duration} suffix="分钟" />
                <p className="mt-2 text-gray-600">{mode.description}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 数据统计 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">数据统计</h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="总游戏次数" value={statistics.totalGames} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="胜率" value={statistics.winRate} suffix="%" precision={2} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="最大连胜" value={statistics.maxWinStreak} />
              </Card>
            </Col>
          </Row>
        </div>

        {/* 历史走势图 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">历史走势</h2>
          <Card>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="result" stroke="#8884d8" name="开奖结果" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 最近开奖记录 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">最近开奖记录</h2>
          <Card>
            <Table
              columns={columns}
              dataSource={historyData}
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
