import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button } from 'antd';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TransactionOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      { key: 'user-list', label: '用户列表' },
      { key: 'user-levels', label: '用户等级' },
      { key: 'credit-scores', label: '信用评分' },
    ],
  },
  {
    key: 'games',
    icon: <AppstoreOutlined />,
    label: '游戏管理',
    children: [
      { key: 'game-list', label: '游戏列表' },
      { key: 'lottery-settings', label: '开奖设置' },
      { key: 'game-records', label: '游戏记录' },
    ],
  },
  {
    key: 'transactions',
    icon: <TransactionOutlined />,
    label: '交易管理',
    children: [
      { key: 'deposits', label: '充值记录' },
      { key: 'withdrawals', label: '提现记录' },
      { key: 'betting-records', label: '投注记录' },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 