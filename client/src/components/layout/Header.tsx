import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AntHeader>
      <Menu theme="dark" mode="horizontal" />
    </AntHeader>
  );
};

export default Header; 