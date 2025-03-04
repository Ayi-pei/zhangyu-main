import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { userAPI } from '../services/api';
import { IUser } from '../../../server/types';
import type { User } from '@/types/user.types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 为测试环境创建一个简化版本
export const TestAuthProvider = ({ 
  children,
  initialState = { isAuthenticated: false }
}: { 
  children: React.ReactNode;
  initialState?: {
    isAuthenticated: boolean;
    role?: 'user' | 'admin';
  };
}) => {
  const [user, setUser] = useState<User | null>(
    initialState.isAuthenticated ? {
      id: '1',
      username: 'testuser',
      role: initialState.role || 'user'
    } : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (username === 'admin' && password === '123456') {
        const user = { id: '1', username: 'admin', role: 'admin' };
        setUser(user);
        return { role: 'admin' };
      } else if (username && password === '123456') {
        const user = { id: '1', username, role: 'user' };
        setUser(user);
        return { role: 'user' };
      }
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// 生产环境使用的完整版本
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await userAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.login({ username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      message.success('登录成功');
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
      message.success('已退出登录');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登出失败');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, checkAuth, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
