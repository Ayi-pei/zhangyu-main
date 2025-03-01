// FILEPATH: d:/ayi/zhangyu-main/client/src/components/AppLayout.tsx

import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const { Header, Content, Footer } = Layout;

export const AppLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header className="fixed w-full z-10 p-0">
        <TopBar />
      </Header>
      <Content className="mt-16 mb-16 p-4">
        <Outlet />
      </Content>
      <Footer className="fixed bottom-0 w-full p-0">
        <BottomNav />
      </Footer>
    </Layout>
  );
};

export default AppLayout;
