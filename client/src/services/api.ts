import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  register: (userData: RegisterData) => 
    api.post('/auth/register', userData)
};

export const gameAPI = {
  createGame: (gameData: GameData) => 
    api.post('/games', gameData),
  joinGame: (gameId: string) => 
    api.post(`/games/${gameId}/join`)
};

// 用户相关 API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data: Partial<IUser>) => api.put('/users/profile', data),
  changePassword: (data: PasswordChangeData) => api.post('/users/change-password', data),
  getUserStats: () => api.get('/users/stats')
};

// 管理员相关 API
export const adminAPI = {
  getUsers: (params?: UserQueryParams) => api.get('/admin/users', { params }),
  updateUser: (userId: string, data: Partial<IUser>) => 
    api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getLotteryStats: () => api.get('/admin/lottery/stats'),
  getDashboardData: () => api.get('/api/admin/dashboard'),
  batchDeleteUsers: (ids: string[]) => 
    api.post('/api/admin/users/batch-delete', { ids }),
  batchUpdateUsers: (ids: string[], data: any) =>
    api.post('/api/admin/users/batch-update', { ids, data }),
  exportUsers: () => 
    api.get('/api/admin/users/export', { responseType: 'blob' }),
  getApprovalRequests: (params?: any) => 
    api.get('/api/admin/approvals', { params }),
  processApproval: (data: {
    requestId: string;
    approved: boolean;
    remark: string;
  }) => api.post('/api/admin/approvals/process', data),
  getOperationLogs: (params?: any) =>
    api.get('/api/admin/logs', { params })
};

// 抽奖相关 API
export const lotteryAPI = {
  createLottery: (data: LotteryData) => api.post('/lottery', data),
  joinLottery: (lotteryId: string) => api.post(`/lottery/${lotteryId}/join`),
  getLotteryHistory: () => api.get('/lottery/history'),
  getLotteryResults: (lotteryId: string) => api.get(`/lottery/${lotteryId}/results`)
}; 