// src/utils/api.ts

// 定义后端 API 的基础 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * 通用 API 请求函数
 * @param endpoint - API 端点路径，例如 '/login'
 * @param method - HTTP 方法，默认 'GET'
 * @param data - 可选的请求体数据（会被 JSON.stringify 处理）
 * @returns Promise resolving to JSON 响应数据
 */
export async function request(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // 如有需要，可在此处添加 Authorization 头部
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    // 尝试获取错误信息
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
}

/**
 * 登录接口
 * @param email - 用户邮箱
 * @param password - 用户密码
 * @returns Promise resolving to登录结果
 */
export async function login(email: string, password: string): Promise<any> {
  return request('/login', 'POST', { email, password });
}

/**
 * 充值接口（增加用户积分）
 * @param userId - 用户 ID
 * @param amount - 充值金额
 * @returns Promise resolving to更新结果
 */
export async function recharge(userId: string, amount: number): Promise<any> {
  return request('/users/recharge', 'POST', { userId, amount });
}

/**
 * 积分兑换接口（减少用户积分）
 * @param userId - 用户 ID
 * @param amount - 兑换金额
 * @returns Promise resolving to更新结果
 */
export async function exchange(userId: string, amount: number): Promise<any> {
  return request('/users/exchange', 'POST', { userId, amount });
}

/**
 * 获取用户信息
 * @param userId - 用户 ID
 * @returns Promise resolving to用户数据
 */
export async function getUser(userId: string): Promise<any> {
  return request(`/users/${userId}`, 'GET');
}

/**
 * 更新用户信息
 * @param userId - 用户 ID
 * @param updateData - 要更新的数据对象
 * @returns Promise resolving to更新后的用户数据
 */
export async function updateUser(userId: string, updateData: any): Promise<any> {
  return request(`/users/${userId}`, 'PUT', updateData);
}
