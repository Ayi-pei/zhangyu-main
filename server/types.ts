// src/types.ts

// 用户的完整类型
export interface IUser {
    id: string;         // 用户 ID（6-8位任意字符）
    username: string;   // 昵称
    role?: string;      // 角色（可选，默认普通用户）
  }
  
  // 用户登录时需要的基本类型
  export type User = {
    username: string;
    password: string;
  };
  