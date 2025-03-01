// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userAPI } from '../services/api';
import { RootState } from '../store/types';
import { ArrowLeft, MessageCircle, RefreshCw, History, LogOut, Star, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { message, Spin, Card, Tabs, Table, Button, Modal, Form, Input, Tag, Drawer } from 'antd';
import './Profile.css';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface UserLevel {
  level: 1 | 2 | 3 | 4;
  title: string;
  color: string;
}

const LEVEL_CONFIG: Record<number, { title: string; color: string; stars: number }> = {
  1: { title: '初级会员', color: '#808080', stars: 1 },
  2: { title: '黄金会员', color: '#FFD700', stars: 1 },
  3: { title: '白金会员', color: '#FFD700', stars: 2 },
  4: { title: '钻石会员', color: '#FFD700', stars: 3 }
};

interface Transaction {
  id: string;
  type: 'betting' | 'recharge' | 'withdraw';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
  description: string;
}

interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  holderName: string;
  exchangeCode?: string; // 6位数字兑换码
}

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    winRate: 0,
    totalWinnings: 0
  });
  const [showSupport, setShowSupport] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isBindCardModalVisible, setIsBindCardModalVisible] = useState(false);
  const [isSupportDrawerVisible, setIsSupportDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { colors, theme, setTheme } = useTheme();

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchUserData();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('获取用户统计信息失败:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const [balanceRes, transactionsRes, cardsRes] = await Promise.all([
        axios.get('/api/user/balance'),
        axios.get('/api/user/transactions'),
        axios.get('/api/user/bank-cards')
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
      setBankCards(cardsRes.data);
    } catch (error) {
      message.error('获取用户数据失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  const renderStars = (level: number) => {
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    return Array(config.stars).fill(0).map((_, i) => (
      <Star 
        key={i}
        fill={config.color}
        stroke={config.color}
        className="w-6 h-6"
      />
    ));
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleRecharge = async (values: any) => {
    try {
      await axios.post('/api/user/recharge', values);
      message.success('充值申请已提交');
      setIsRechargeModalVisible(false);
      fetchUserData();
    } catch (error) {
      message.error('充值失败');
    }
  };

  const handleWithdraw = async (values: any) => {
    try {
      await axios.post('/api/user/withdraw', values);
      message.success('提现申请已提交');
      setIsWithdrawModalVisible(false);
      fetchUserData();
    } catch (error) {
      message.error('提现失败');
    }
  };

  const handleBindCard = async (values: any) => {
    try {
      // 检查是否是首次绑卡
      const isFirstCard = bankCards.length === 0;
      
      if (isFirstCard && !values.exchangeCode) {
        message.error('首次绑卡需要设置游戏积分兑换码');
        return;
      }

      await axios.post('/api/user/bind-card', {
        ...values,
        exchangeCode: isFirstCard ? values.exchangeCode : undefined
      });
      message.success('银行卡绑定成功');
      setIsBindCardModalVisible(false);
      fetchUserData();
    } catch (error) {
      message.error('银行卡绑定失败');
    }
  };

  const transactionColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          betting: '投注',
          recharge: '充值',
          withdraw: '提现'
        };
        return typeMap[type as keyof typeof typeMap];
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          success: <Tag color="success">成功</Tag>,
          pending: <Tag color="processing">处理中</Tag>,
          failed: <Tag color="error">失败</Tag>
        };
        return statusMap[status as keyof typeof statusMap];
      }
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  const items = [
    {
      key: '1',
      label: '交易明细',
      children: (
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )
    },
    {
      key: '2',
      label: '银行卡',
      children: (
        <div>
          {bankCards.map(card => (
            <Card key={card.id} className="mb-4">
              <p>开户行：{card.bankName}</p>
              <p>卡号：{card.cardNumber}</p>
              <p>持卡人：{card.holderName}</p>
            </Card>
          ))}
          <Button type="primary" onClick={() => setIsBindCardModalVisible(true)}>
            绑定新卡
          </Button>
        </div>
      )
    }
  ];

  const themeOptions = [
    { value: 'light', label: '明亮' },
    { value: 'dark', label: '暗黑' },
    { value: 'business', label: '商务' },
    { value: 'soft', label: '柔和' }
  ];

  if (!user) {
    return <Spin className="profile-spinner" />;
  }

  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="mb-4">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="theme-select"
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border
          }}
        >
          {themeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">个人中心</h2>
            <p className="text-gray-600">ID：{user?.id}</p>
          </div>
          <Button type="link" onClick={() => logout()}>退出登录</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-gray-600">账户余额</p>
              <p className="text-2xl font-bold">¥{balance.toFixed(2)}</p>
              <div className="mt-4 space-x-4">
                <Button type="primary" onClick={() => setIsRechargeModalVisible(true)}>
                  充值
                </Button>
                <Button onClick={() => setIsWithdrawModalVisible(true)}>
                  提现
                </Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-gray-600">会员等级</p>
              <p className="text-2xl font-bold">VIP 1</p>
              <p className="text-gray-600 mt-2">信誉分：85</p>
            </div>
          </Card>
        </div>

        <Button 
          type="link" 
          className="mb-4"
          onClick={() => setIsSupportDrawerVisible(true)}
        >
          联系客服
        </Button>

        <Tabs items={items} />
      </Card>

      {/* 充值弹窗 */}
      <Modal
        title="充值"
        open={isRechargeModalVisible}
        onCancel={() => setIsRechargeModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleRecharge}>
          <Form.Item
            name="amount"
            label="充值金额"
            rules={[{ required: true, message: '请输入充值金额' }]}
          >
            <Input type="number" prefix="¥" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认充值
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 绑定银行卡弹窗 */}
      <Modal
        title="绑定银行卡"
        open={isBindCardModalVisible}
        onCancel={() => setIsBindCardModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleBindCard}>
          <Form.Item
            name="bankName"
            label="开户行"
            rules={[{ required: true, message: '请输入开户行' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cardNumber"
            label="卡号"
            rules={[{ required: true, message: '请输入卡号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="holderName"
            label="持卡人"
            rules={[{ required: true, message: '请输入持卡人姓名' }]}
          >
            <Input />
          </Form.Item>
          {bankCards.length === 0 && (
            <Form.Item
              name="exchangeCode"
              label="积分兑换码"
              rules={[
                { required: true, message: '请输入6位数字兑换码' },
                { pattern: /^\d{6}$/, message: '兑换码必须是6位数字' }
              ]}
              extra="首次绑卡需要设置6位数字兑换码，用于提现时的安全验证"
            >
              <Input placeholder="请输入6位数字兑换码" maxLength={6} />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认绑定
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 提现弹窗 */}
      <Modal
        title="提现"
        open={isWithdrawModalVisible}
        onCancel={() => setIsWithdrawModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleWithdraw}>
          <Form.Item
            name="amount"
            label="提现金额"
            rules={[{ required: true, message: '请输入提现金额' }]}
          >
            <Input type="number" prefix="¥" />
          </Form.Item>
          <Form.Item
            name="cardId"
            label="选择银行卡"
            rules={[{ required: true, message: '请选择银行卡' }]}
          >
            <select className="w-full border p-2 rounded">
              {bankCards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.bankName} - {card.cardNumber}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item
            name="exchangeCode"
            label="积分兑换码"
            rules={[
              { required: true, message: '请输入积分兑换码' },
              { pattern: /^\d{6}$/, message: '兑换码必须是6位数字' }
            ]}
          >
            <Input placeholder="请输入6位数字兑换码" maxLength={6} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认提现
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 客服抽屉 */}
      <Drawer
        title="联系客服"
        placement="right"
        onClose={() => setIsSupportDrawerVisible(false)}
        open={isSupportDrawerVisible}
      >
        <div className="space-y-4">
          <p>客服热线：400-888-8888</p>
          <p>服务时间：09:00 - 21:00</p>
          <p>QQ客服：123456789</p>
          <p>微信客服：zhangyu-service</p>
        </div>
      </Drawer>
    </div>
  );
};

export default Profile;

