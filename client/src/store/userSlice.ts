// src/store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../server/types';  // 确保路径正确

// 定义 Redux 中的用户状态
interface UserState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// 初始状态
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false
};

// 创建 userSlice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUser: (state: UserState, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    // 用户登出
    logout: (state: UserState) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    }
  }
});

// 导出 actions
export const { setUser, logout } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;
