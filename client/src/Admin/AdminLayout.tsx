import React, { useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { UserOutlined, DashboardOutlined, AppstoreOutlined, TransactionOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/admin/bets', icon: <TransactionOutlined />, label: '投注管理' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <Button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '展开' : '收起'}
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: theme.colorBgContainer }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 