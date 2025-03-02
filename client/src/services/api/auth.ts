import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '@/types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials
    );
    return response.data;
  },

  logout: async () => {
    await axios.post(`${API_URL}/auth/logout`);
  },

  getProfile: async () => {
    const response = await axios.get<AuthResponse>(`${API_URL}/auth/profile`);
    return response.data;
  },

  // 添加请求拦截器来处理认证令牌
  setupInterceptors: (getToken: () => string | null) => {
    axios.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器来处理认证错误
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 处理未认证的情况
          localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}; 