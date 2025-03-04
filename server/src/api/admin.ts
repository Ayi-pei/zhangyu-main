import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// 获取所有用户
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// 获取某个用户的详细信息
export const fetchUserDetails = async (userId: string) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

// 更新用户信息
export const updateUserDetails = async (userId: string, data: any) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, data);
  return response.data;
};

// 封禁/解封用户
export const toggleUserStatus = async (userId: string, isBanned: boolean) => {
  const response = await axios.patch(`${API_URL}/users/${userId}/status`, { isBanned });
  return response.data;
};

// 获取投注记录
export const fetchBets = async () => {
  const response = await axios.get(`${API_URL}/bets`);
  return response.data;
};

// 获取开奖统计数据
export const fetchStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
