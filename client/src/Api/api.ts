import axios, { AxiosResponse } from 'axios';
import { mockAPI } from './src/src/services/mockApi';
import {
  IUser,
  LoginCredentials,
  RegisterData,
  LotteryData,
  TransactionRecord
} from '../../../server/types';

// API 响应类型
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API 基础配置
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10秒超时
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('权限不足');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败');
      }
    }
    return Promise.reject(error);
  }
);

// 用户相关 API
export const userAPI = {
  // 认证相关
  login: (credentials: LoginCredentials) => 
    process.env.NODE_ENV === 'development' 
      ? mockAPI.login(credentials)
      : api.post('/auth/login', credentials),

  register: (data: RegisterData) => 
    process.env.NODE_ENV === 'development'
      ? mockAPI.register(data)
      : api.post('/auth/register', data),

  // 用户信息相关
  getProfile: () => 
    process.env.NODE_ENV === 'development'
      ? mockAPI.getProfile()
      : api.get('/users/profile'),

  updateProfile: (data: Partial<IUser>) => 
    process.env.NODE_ENV === 'development'
      ? mockAPI.updateProfile(data)
      : api.put('/users/profile', data),

  // 安全相关
  changePassword: (oldPassword: string, newPassword: string) => 
    api.put('/users/password', { oldPassword, newPassword }),

  // 资金相关
  recharge: (amount: number, paymentMethod: string) => 
    api.post('/users/recharge', { amount, paymentMethod }),

  withdraw: (amount: number, bankInfo: string) => 
    api.post('/users/withdraw', { amount, bankInfo })
};

// 游戏相关 API
export const gameAPI = {
  // 投注相关
  placeBet: (type: string, amount: number, options: string[]) => 
    api.post('/games/bet', { type, amount, options }),

  // 彩票相关
  placeLotteryBet: (period: number, amount: number, numbers: string[]) => 
    api.post('/games/lottery/bet', { period, amount, numbers }),

  // 历史记录
  getHistory: (type?: string, startDate?: string, endDate?: string) => 
    api.get('/games/history', { params: { type, startDate, endDate } })
};

// 管理员相关 API
export const adminAPI = {
  // 用户管理
  getUsers: (params?: { 
    page?: number; 
    pageSize?: number;
    search?: string;
    status?: string;
  }) => process.env.NODE_ENV === 'development'
    ? mockAPI.getUsers()
    : api.get('/admin/users', { params }),

  createUser: (data: Partial<IUser>) => 
    api.post('/admin/users', data),

  updateUser: (userId: string, data: Partial<IUser>) => 
    api.put(`/admin/users/${userId}`, data),

  deleteUser: (userId: string) => 
    process.env.NODE_ENV === 'development'
      ? mockAPI.deleteUser(userId)
      : api.delete(`/admin/users/${userId}`),

  sendMessage: (userId: string, message: string) => 
    api.post(`/admin/users/${userId}/message`, { message }),
  
  // 交易管理
  getTransactions: (params?: {
    page?: number;
    pageSize?: number;
    type?: 'deposit' | 'withdraw';
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<ApiResponse<{
    records: TransactionRecord[];
    total: number;
    page: number;
    pageSize: number;
  }>>> => api.get('/admin/transactions', { params }),

  processTransaction: (transactionId: string, data: { 
    status: 'approved' | 'rejected';
    remark: string;
  }): Promise<AxiosResponse<ApiResponse<TransactionRecord>>> => 
    api.put(`/admin/transactions/${transactionId}`, data),
  
  // 投注管理
  getBettingRecords: (params: {
    page: number;
    pageSize: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/admin/betting/records', { params }),

  getFutureResults: () => 
    api.get('/admin/betting/future-results'),

  updateBettingResult: (data: {
    period: number;
    result: string;
    openTime: string;
  }) => api.put('/admin/betting/result', data),

  updateBetting: (id: string, data: {
    status: 'pending' | 'won' | 'lost';
    result?: string;
    remark?: string;
  }) => api.put(`/admin/betting/${id}`, data)
};

// 抽奖相关 API
export const lotteryAPI = {
  // 创建抽奖
  createLottery: (data: LotteryData) => 
    api.post('/lottery', data),

  // 参与抽奖
  joinLottery: (lotteryId: string) => 
    api.post(`/lottery/${lotteryId}/join`),

  // 获取历史记录
  getLotteryHistory: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }) => api.get('/lottery/history', { params }),

  // 获取开奖结果
  getLotteryResults: (lotteryId: string) => 
    api.get(`/lottery/${lotteryId}/results`),

  // 获取当前进行中的抽奖
  getCurrentLotteries: () => 
    api.get('/lottery/current')
}; 