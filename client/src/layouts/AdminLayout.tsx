import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Settings, BarChart2, 
  Activity, LogOut, ChevronDown, Menu, CheckSquare, List
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './AdminLayout.css';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'users',
    label: '用户管理',
    icon: <Users size={20} />,
    children: [
      { key: 'user-list', label: '用户列表', path: '/admin/users', icon: <Users size={16} /> },
      { key: 'user-stats', label: '用户统计', path: '/admin/users/stats', icon: <BarChart2 size={16} /> },
      { key: 'credit-manage', label: '信誉分管理', path: '/admin/users/credit', icon: <Activity size={16} /> }
    ]
  },
  {
    key: 'games',
    label: '游戏管理',
    icon: <Activity size={20} />,
    children: [
      { key: 'game-list', label: '游戏列表', path: '/admin/games', icon: <Activity size={16} /> },
      { key: 'game-stats', label: '游戏统计', path: '/admin/games/stats', icon: <BarChart2 size={16} /> }
    ]
  },
  {
    key: 'system',
    label: '系统设置',
    icon: <Settings size={20} />,
    children: [
      { key: 'site-config', label: '网站配置', path: '/admin/settings', icon: <Settings size={16} /> },
      { key: 'logs', label: '系统日志', path: '/admin/logs', icon: <List size={16} /> }
    ]
  },
  {
    key: 'reports',
    label: '数据报表',
    icon: <BarChart2 size={20} />,
    children: [
      { key: 'daily-report', label: '日报表', path: '/admin/reports/daily', icon: <BarChart2 size={16} /> },
      { key: 'monthly-report', label: '月报表', path: '/admin/reports/monthly', icon: <BarChart2 size={16} /> }
    ]
  },
  {
    key: 'approvals',
    label: '审批管理',
    icon: <CheckSquare size={20} />,
    children: [
      { key: 'pending-approvals', label: '待审批', path: '/admin/approvals', icon: <CheckSquare size={16} /> },
      { key: 'approval-history', label: '审批历史', path: '/admin/approvals/history', icon: <CheckSquare size={16} /> }
    ]
  },
  {
    key: 'logs',
    label: '操作日志',
    icon: <List size={20} />,
    path: '/admin/logs'
  }
];

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, theme, setTheme } = useTheme();
  const admin = useSelector((state: RootState) => state.admin.currentAdmin);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const toggleSubMenu = (key: string) => {
    setOpenKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleLogout = () => {
    // 实现登出逻辑
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout" style={{ backgroundColor: colors.background }}>
      {/* 侧边栏 */}
      <aside 
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }}
      >
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="logo" />
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <div key={item.key} className="menu-item-group">
              <div 
                className="menu-item"
                onClick={() => toggleSubMenu(item.key)}
                style={{
                  color: openKeys.includes(item.key) ? colors.primary : colors.text
                }}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={16} 
                      className={`arrow ${openKeys.includes(item.key) ? 'rotated' : ''}`}
                    />
                  </>
                )}
              </div>
              
              {!collapsed && openKeys.includes(item.key) && item.children && (
                <div className="submenu">
                  {item.children.map(child => (
                    <div
                      key={child.key}
                      className={`submenu-item ${location.pathname === child.path ? 'active' : ''}`}
                      onClick={() => child.path && handleMenuClick(child.path)}
                      style={{
                        backgroundColor: location.pathname === child.path 
                          ? colors.primary + '20'
                          : 'transparent',
                        color: location.pathname === child.path
                          ? colors.primary
                          : colors.text
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 顶部导航栏 */}
        <header 
          className="top-nav"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <div className="breadcrumb">
            {/* 根据当前路由显示面包屑 */}
            管理后台 / {location.pathname.split('/').slice(-1)[0]}
          </div>

          <div className="user-menu">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="theme-select"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border
              }}
            >
              <option value="light">明亮主题</option>
              <option value="dark">暗黑主题</option>
              <option value="business">商务主题</option>
              <option value="soft">柔和主题</option>
            </select>

            <div className="admin-info">
              <img 
                src={admin?.avatar || '/default-avatar.png'} 
                alt="Avatar"
                className="avatar"
              />
              <span className="username">{admin?.username}</span>
            </div>

            <button 
              className="logout-btn"
              onClick={handleLogout}
              style={{
                backgroundColor: colors.error,
                color: '#fff'
              }}
            >
              <LogOut size={16} />
              退出
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}; 