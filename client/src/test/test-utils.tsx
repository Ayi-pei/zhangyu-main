import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TestThemeProvider } from '../context/ThemeContext';
import { TestAuthProvider } from '../context/AuthContext';
import { LoginPage } from './mocks/LoginPage';

// 创建一个简单的主题配置
const theme = {
  token: {
    colorPrimary: '#00b96b',
  },
};

// 创建一个简单的 ConfigProvider mock
const MockConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-config-provider">{children}</div>;
};

// 创建测试路由配置
const TestRoutes = ({ children }: { children: React.ReactNode }) => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
    <Route path="/profile" element={<div>User Profile</div>} />
    <Route path="/" element={children} />
  </Routes>
);

interface ProvidersProps {
  children: React.ReactNode;
  initialPath?: string;
  initialAuthState?: {
    isAuthenticated: boolean;
    role?: 'user' | 'admin';
  };
}

// 创建测试包装器
const AllTheProviders = ({ children, initialPath = '/', initialAuthState }: ProvidersProps) => {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <TestThemeProvider>
        <TestAuthProvider initialState={initialAuthState}>
          <TestRoutes>
            {children}
          </TestRoutes>
        </TestAuthProvider>
      </TestThemeProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  {
    initialPath,
    initialAuthState,
    ...options
  }: {
    initialPath?: string;
    initialAuthState?: {
      isAuthenticated: boolean;
      role?: 'user' | 'admin';
    };
  } & Parameters<typeof render>[1] = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialPath={initialPath}
        initialAuthState={initialAuthState}
      >
        {children}
      </AllTheProviders>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render }; 