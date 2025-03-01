import React, { useState } from 'react';
import { Layout, Menu, Input, DatePicker, Select, Button } from 'antd';
import { 
  UserOutlined, 
  DashboardOutlined,
  GameOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('username');

  const handleSearch = (value: string) => {
    switch(searchType) {
      case 'username':
        navigate(`/admin/users?search=${value}`);
        break;
      case 'ip':
        navigate(`/admin/users?ip=${value}`);
        break;
      case 'level':
        navigate(`/admin/users?level=${value}`);
        break;
      case 'lottery':
        navigate(`/admin/lottery?result=${value}`);
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/admin/dashboard')
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      onClick: () => navigate('/admin/users')
    },
    {
      key: 'betting',
      icon: <GameOutlined />,
      label: '投注管理',
      onClick: () => navigate('/admin/betting')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <Select
              defaultValue="username"
              style={{ width: 120, marginRight: 16 }}
              onChange={value => setSearchType(value)}
              options={[
                { value: 'username', label: '用户名' },
                { value: 'ip', label: '用户IP' },
                { value: 'level', label: '会员等级' },
                { value: 'lottery', label: '开奖结果' }
              ]}
            />
            <Search
              placeholder="请输入搜索内容"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <DatePicker 
              style={{ marginLeft: 16 }}
              onChange={(date) => {
                if (date) {
                  navigate(`/admin/records?date=${date.format('YYYY-MM-DD')}`);
                }
              }}
            />
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}; 