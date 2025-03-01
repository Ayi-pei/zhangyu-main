import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children || <Outlet />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 