// FILEPATH: d:/ayi/zhangyu-main/client/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { AdminLayout } from './components/admin/AdminLayout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { UserManagement } from './pages/admin/UserManagement';
import { BettingManagement } from './pages/admin/BettingManagement';

// 页面导入
import NotFound from './pages/NotFound';
import Lottery from './pages/Lottery';
import Betting from './pages/Betting';
import History from './pages/History';

// 管理页面导入
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminContent from './pages/admin/Content';
import AdminLottery from './pages/admin/Lottery';

// 组件导入
import AppLayout from './components/AppLayout';

// Context导入
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <SettingsProvider>
            <ConfigProvider locale={zhCN}>
              <Router>
                <Routes>
                  {/* 公开路由 */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  } />
                  <Route path="/profile" element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  } />
                  <Route path="/lottery" element={<Lottery />} />
                  <Route path="/betting" element={<Betting />} />
                  <Route path="/history" element={<History />} />
                  
                  {/* 管理员路由 */}
                  <Route path="/admin" element={
                    <RequireAuth requireAdmin>
                      <AdminLayout>
                        <Outlet />
                      </AdminLayout>
                    </RequireAuth>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="betting" element={<BettingManagement />} />
                  </Route>

                  {/* 404 页面 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ConfigProvider>
          </SettingsProvider>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
