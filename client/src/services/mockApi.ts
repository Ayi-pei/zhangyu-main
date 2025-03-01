import { IUser, LoginCredentials, RegisterData } from '../types';

// 模拟用户数据
const mockUsers: IUser[] = [
  {
    id: '1',
    username: 'admin01',
    email: 'admin@example.com',
    role: 'admin',
    balance: 10000,
    creditScore: 100,
    level: {
      level: 4,
      title: '超级管理员',
      color: '#f50'
    },
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'user01',
    email: 'user01@example.com',
    role: 'user',
    balance: 1000,
    creditScore: 80,
    level: {
      level: 1,
      title: '普通用户',
      color: '#87d068'
    },
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// 模拟投注记录
const mockBettingRecords = [
  {
    id: '1',
    userId: '2',
    username: 'user01',
    type: 'lottery',
    amount: 100,
    options: ['high'],
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '2',
    username: 'user01',
    type: 'game',
    amount: 200,
    options: ['red'],
    status: 'won',
    createdAt: new Date().toISOString()
  }
];

export const mockAPI = {
  login: async (credentials: LoginCredentials) => {
    const user = mockUsers.find(u => u.username === credentials.username);
    if (user && credentials.password === 'admins01') {
      return Promise.resolve({
        data: {
          token: 'mock-token',
          user
        }
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  register: async (data: RegisterData) => {
    const newUser: IUser = {
      id: String(mockUsers.length + 1),
      username: data.username,
      email: data.email,
      role: 'user',
      balance: 0,
      creditScore: 60,
      level: {
        level: 1,
        title: '新用户',
        color: '#87d068'
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return Promise.resolve({ data: newUser });
  },

  getProfile: async () => {
    return Promise.resolve({ data: mockUsers[0] });
  },

  updateProfile: async (data: Partial<IUser>) => {
    const user = mockUsers[0];
    Object.assign(user, data);
    return Promise.resolve({ data: user });
  },

  getUsers: async () => {
    return Promise.resolve({ data: mockUsers });
  },

  deleteUser: async (userId: string) => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index > -1) {
      mockUsers.splice(index, 1);
    }
    return Promise.resolve({ data: { success: true } });
  },

  getBettingRecords: async () => {
    return Promise.resolve({
      data: {
        records: mockBettingRecords,
        total: mockBettingRecords.length
      }
    });
  }
}; 