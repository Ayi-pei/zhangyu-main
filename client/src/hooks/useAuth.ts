// FILEPATH: d:/ayi/zhangyu-main/client/src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authAPI } from '../utils/api';
import storage from '../utils/storage';

interface User {
  id: string;
  username: string;
  balance: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    const token = storage.getToken();
    if (token) {
      try {
        const response = await authAPI.verifyToken();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;
      storage.setToken(token);
      storage.setUser(user);
      setUser(user);
      setIsAuthenticated(true);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await authAPI.register(username, password);
      message.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
    setIsAuthenticated(false);
    message.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  const updateUserBalance = useCallback((newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserBalance
  };
};
