// FILEPATH: d:/ayi/zhangyu-main/client/src/components/Sidebar.tsx

import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  HistoryOutlined,
  GamepadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const StyledSider = styled(Sider)`
  @media (max-width: 768px) {
    position: absolute;
    height: 100vh;
    z-index: 999;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { themeMode } = useTheme();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
    { key: '/history', icon: <HistoryOutlined />, label: 'History' },
    { key: '/game', icon: <GamepadOutlined />, label: 'Game' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <StyledSider
      width={200}
      theme={themeMode}
      breakpoint="lg"
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => {
          navigate(key);
        }}
        theme={themeMode}
      />
    </StyledSider>
  );
};

export default Sidebar;
