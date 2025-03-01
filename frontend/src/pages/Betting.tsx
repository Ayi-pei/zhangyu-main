import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Select, message, Row, Col, Statistic, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Countdown } from 'antd';

interface BettingOption {
  id: string;
  name: string;
  odds: number;
}

interface HistoryRecord {
  id: string;
  period: string;
  result: number;
  timestamp: string;
}

const Betting: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [endTime, setEndTime] = useState<number>(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBalance();
    fetchGameInfo();
    fetchHistory();
    
    // 每秒更新倒计时
    const timer = setInterval(() => {
      fetchGameInfo();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await axios.get('/api/user/balance');
      setBalance(response.data.balance);
    } catch (error) {
      message.error('获取余额失败');
    }
  };

  const fetchGameInfo = async () => {
    try {
      const response = await axios.get('/api/game/current');
      setCurrentPeriod(response.data.period);
      setEndTime(response.data.endTime);
    } catch (error) {
      message.error('获取游戏信息失败');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/game/history?limit=5');
      setHistory(response.data);
    } catch (error) {
      message.error('获取历史记录失败');
    }
  };

  const handleBet = async (values: any) => {
    if (values.amount > balance) {
      message.error('余额不足');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/betting/place', {
        ...values,
        period: currentPeriod
      });
      message.success('投注成功');
      fetchUserBalance();
      form.resetFields();
    } catch (error) {
      message.error('投注失败');
    } finally {
      setLoading(false);
    }
  };

  const historyColumns = [
    {
      title: '期号',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '开奖结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: number) => {
        const isEven = result % 2 === 0;
        const isBig = result > 4;
        return (
          <div>
            <span className="mr-2">{result}</span>
            <Tag color={isEven ? 'blue' : 'red'}>{isEven ? '双' : '单'}</Tag>
            <Tag color={isBig ? 'green' : 'orange'}>{isBig ? '大' : '小'}</Tag>
          </div>
        );
      }
    },
    {
      title: '开奖时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    }
  ];

  const bettingOptions = [
    { id: 'big', name: '大', odds: 2 },
    { id: 'small', name: '小', odds: 2 },
    { id: 'odd', name: '单', odds: 2 },
    { id: 'even', name: '双', odds: 2 }
  ];

  return (
    <div className="container mx-auto p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="当前期号" value={currentPeriod} />
              </Col>
              <Col span={8}>
                <Statistic title="当前余额" value={balance} precision={2} prefix="¥" />
              </Col>
              <Col span={8}>
                <Statistic
                  title="开奖倒计时"
                  value={endTime}
                  formatter={(value) => (
                    <Countdown
                      value={value}
                      format="mm:ss"
                      onFinish={fetchGameInfo}
                    />
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="投注面板">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleBet}
            >
              <Form.Item
                name="optionId"
                label="投注选项"
                rules={[{ required: true, message: '请选择投注选项' }]}
              >
                <Select>
                  {bettingOptions.map(option => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name} (赔率: {option.odds})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="投注金额"
                rules={[
                  { required: true, message: '请输入投注金额' },
                  { type: 'number', min: 1, message: '最小投注金额为1' },
                  { type: 'number', max: balance, message: '投注金额不能超过余额' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入投注金额"
                  max={balance}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  disabled={!endTime}
                >
                  确认投注
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="近5期开奖记录">
            <Table
              columns={historyColumns}
              dataSource={history}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Betting; 