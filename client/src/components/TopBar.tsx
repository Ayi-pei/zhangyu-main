// FILEPATH: d:/ayi/zhangyu-main/client/src/components/TopBar.tsx

import React from 'react';
import { Layout, Menu, Input, Avatar, Dropdown, Switch } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;
const { Search } = Input;

interface TopBarProps {
  onSearch?: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        My App
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
          placeholder="Search..."
          onSearch={onSearch}
          style={{ width: 200, marginRight: 16 }}
          prefix={<SearchOutlined />}
        />
        <Switch
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={themeMode === 'dark'}
          onChange={toggleTheme}
          style={{ marginRight: 16 }}
        />
        {user ? (
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />}>
              {user.username[0].toUpperCase()}
            </Avatar>
          </Dropdown>
        ) : (
          <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} onClick={() => navigate('/login')} />
        )}
      </div>
    </Header>
  );
};

export default TopBar;
