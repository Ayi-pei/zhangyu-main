import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '@/context';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AntHeader>
      <Menu theme={theme} mode="horizontal" />
    </AntHeader>
  );
};

export default Header; 