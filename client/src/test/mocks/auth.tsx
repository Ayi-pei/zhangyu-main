import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  role?: 'user' | 'admin';
}

// 模拟认证上下文
export const createMockAuthContext = (initialState: AuthState = { isAuthenticated: false }) => {
  const mockUser = initialState.isAuthenticated ? {
    id: '1',
    username: 'testuser',
    role: initialState.role || 'user'
  } : null;

  return {
    user: mockUser,
    isAdmin: mockUser?.role === 'admin',
    loading: false,
    error: null,
    login: async (username: string, password: string) => {
      if (username === 'admin' && password === '123456') {
        return { role: 'admin' };
      } else if (username && password) {
        return { role: 'user' };
      }
      throw new Error('Invalid credentials');
    },
    logout: async () => {
      // 模拟登出逻辑
    },
    checkAuth: async () => {
      return mockUser;
    }
  };
};

// 模拟需要认证的组件包装器
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const navigate = useNavigate();
    const { user } = createMockAuthContext();

    React.useEffect(() => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }, [user, navigate]);

    return user ? <WrappedComponent {...props} /> : null;
  };
}; 