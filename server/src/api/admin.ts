// FILEPATH: d:/ayi/zhangyu-main/server/src/api/admin.ts

import axios, { AxiosResponse } from 'axios';
import { Bet, Stats, User } from '../types';

const API_URL = process.env.ADMIN_API_URL || 'http://localhost:5000/api/admin';

// 创建一个带有基本配置的 axios 实例
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 设置超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 通用的错误处理函数
const handleError = (error: any): never => {
  console.error('API request failed:', error);
  throw error;
};

// 获取所有用户
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await api.get('/users');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// 获取某个用户的详细信息
export const fetchUserDetails = async (userId: string): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// 更新用户信息
export const updateUserDetails = async (userId: string, data: Partial<User>): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// 封禁/解封用户
export const toggleUserStatus = async (userId: string, isBanned: boolean): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.patch(`/users/${userId}/status`, { isBanned });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// 获取投注记录
export const fetchBets = async (): Promise<Bet[]> => {
  try {
    const response: AxiosResponse<Bet[]> = await api.get('/bets');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// 获取开奖统计数据
export const fetchStats = async (): Promise<Stats> => {
  try {
    const response: AxiosResponse<Stats> = await api.get('/stats');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
