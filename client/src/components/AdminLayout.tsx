import { ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">
            <Link to="/admin/users">用户管理</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/admin/bets">投注管理</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/admin/orders">订单管理</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}; 