// FILEPATH: d:/ayi/zhangyu-main/client/src/components/AppLayout.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Button, Grid } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

const { Content } = Layout;
const { useBreakpoint } = Grid;

interface AppLayoutProps {
  children: React.ReactNode;
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  padding: 24px;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ToggleButton = styled(Button)`
  position: fixed;
  top: 72px;
  left: ${props => props.collapsed ? '80px' : '200px'};
  transition: all 0.2s;
  z-index: 100;
  @media (min-width: 992px) {
    display: none;
  }
`;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { themeMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    if (screens.lg) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [screens]);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  return (
    <StyledLayout>
      <TopBar />
      <Layout>
        <Sidebar 
          collapsed={collapsed} 
          onCollapse={(collapsed) => setCollapsed(collapsed)}
        />
        <Layout>
          <ToggleButton
            type="primary"
            onClick={toggleSider}
            collapsed={collapsed}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          <ContentWrapper>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: themeMode === 'dark' ? '#141414' : '#fff',
              }}
            >
              {children}
            </Content>
          </ContentWrapper>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

export default AppLayout;
