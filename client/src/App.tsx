// FILEPATH: d:/ayi/zhangyu-main/client/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// 导入上下文提供者
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';

// 导入布局组件
import AppLayout from './components/AppLayout';
import LoadingIndicator from './components/LoadingIndicator';

// 导入页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import History from './pages/History';
import Game from './pages/Game';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// 导入全局样式
import { GlobalStyles } from './styles/globalStyles';

// 创建 React Query 客户端
const queryClient = new QueryClient();

const App: React.FC = () => {
  const { themeMode } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <ThemeProvider>
            <SettingsProvider>
              <GlobalStyles theme={themeMode} />
              <Router>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/profile" 
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/history" 
                      element={
                        <PrivateRoute>
                          <History />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/game" 
                      element={
                        <PrivateRoute>
                          <Game />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </Router>
            </SettingsProvider>
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

// PrivateRoute 组件用于保护需要认证的路由
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default App;
