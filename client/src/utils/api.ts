// FILEPATH: d:/ayi/zhangyu-main/client/src/utils/api.ts

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，用于添加认证 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器，用于处理常见错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未认证，可以在这里处理登出逻辑
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string) => 
    api.post('/auth/register', { username, password }),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export const betAPI = {
  placeBet: (direction: 'left' | 'right', steps: number) => 
    api.post('/bets/place', { direction, steps }),
  getBetHistory: (page: number, pageSize: number) => 
    api.get('/bets/history', { params: { page, pageSize } }),
};

export const gameAPI = {
  getGameState: () => api.get('/game/state'),
  startGame: () => api.post('/game/start'),
  endGame: () => api.post('/game/end'),
};

export default api;
