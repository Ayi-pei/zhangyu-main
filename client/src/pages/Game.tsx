// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Game.tsx

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Table, Tag } from 'antd';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface GameRound {
  id: string;
  roundNumber: string;
  startTime: string;
  endTime: string;
  status: string;
  result: string[];
}

interface Bet {
  id: string;
  betType: string[];
  betAmount: number;
  winAmount: number;
  status: string;
  isWin: boolean;
  createdAt: string;
}

const BET_AMOUNT = 100; // 固定投注金额
const BET_OPTIONS = [
  { label: '大', value: 'big' },
  { label: '小', value: 'small' },
  { label: '单', value: 'odd' },
  { label: '双', value: 'even' }
];

export const Game: React.FC = () => {
  const { token } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [balance, setBalance] = useState(0);
  const [selectedBets, setSelectedBets] = useState<string[]>([]);
  const [betHistory, setBetHistory] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取当前回合信息
  const fetchCurrentRound = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/game/current-round', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentRound(response.data.round);
      setTimeLeft(response.data.timeLeft);
    } catch (error) {
      console.error('获取回合信息失败:', error);
      message.error('获取回合信息失败');
    }
  };

  // 获取用户余额
  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('获取余额失败:', error);
      message.error('获取余额失败');
    }
  };

  // 获取投注历史
  const fetchBetHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/game/bet-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBetHistory(response.data.bets);
    } catch (error) {
      console.error('获取投注历史失败:', error);
      message.error('获取投注历史失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchCurrentRound();
    fetchBalance();
    fetchBetHistory();
  }, []);

  // 倒计时
  useEffect(() => {
    if (timeLeft <= 0) {
      fetchCurrentRound();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          fetchCurrentRound();
          fetchBetHistory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 处理投注
  const handleBet = async () => {
    if (selectedBets.length === 0) {
      return message.warning('请选择投注项');
    }

    if (balance < BET_AMOUNT) {
      return message.warning('余额不足');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/game/bet', {
        roundNumber: currentRound?.roundNumber,
        betType: selectedBets,
        betAmount: BET_AMOUNT
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      message.success('投注成功');
      setSelectedBets([]);
      fetchBalance();
      fetchBetHistory();
    } catch (error) {
      console.error('投注失败:', error);
      message.error('投注失败');
    } finally {
      setLoading(false);
    }
  };

  // 投注历史表格列定义
  const columns = [
    {
      title: '回合编号',
      dataIndex: ['round', 'roundNumber'],
      key: 'roundNumber'
    },
    {
      title: '投注类型',
      dataIndex: 'betType',
      key: 'betType',
      render: (betTypes: string[]) => (
        <Space>
          {betTypes.map(type => (
            <Tag key={type} color="blue">{type}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '投注金额',
      dataIndex: 'betAmount',
      key: 'betAmount'
    },
    {
      title: '获胜金额',
      dataIndex: 'winAmount',
      key: 'winAmount'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Bet) => (
        <Tag color={record.isWin ? 'green' : (status === 'pending' ? 'gold' : 'red')}>
          {status === 'pending' ? '待开奖' : (record.isWin ? '赢' : '输')}
        </Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card title="当前回合" className="mb-6">
        <p>回合编号: {currentRound?.roundNumber}</p>
        <p>倒计时: {timeLeft} 秒</p>
        <p>余额: {balance}</p>
        <Space wrap className="my-4">
          {BET_OPTIONS.map(option => (
            <Button
              key={option.value}
              type={selectedBets.includes(option.value) ? 'primary' : 'default'}
              onClick={() => {
                if (selectedBets.includes(option.value)) {
                  setSelectedBets(prev => prev.filter(bet => bet !== option.value));
                } else {
                  setSelectedBets(prev => [...prev, option.value]);
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </Space>
        <Button
          type="primary"
          onClick={handleBet}
          loading={loading}
          disabled={timeLeft === 0 || loading}
          className="mt-4"
        >
          投注 ({BET_AMOUNT})
        </Button>
      </Card>

      <Card title="投注历史">
        <Table
          dataSource={betHistory}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Game;
