export interface IUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  creditScore: number;
  level: {
    level: 1 | 2 | 3 | 4;
    title: string;
    color: string;
  };
  status: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export interface UserQueryParams {
  search?: string;
  level?: number;
  status?: string;
}

export interface GameData {
  type: string;
  amount: number;
  options: string[];
}

export interface LotteryData extends GameData {
  period: number;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
}

export interface TransactionRecord {
  id: string;
  user: IUser;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionApproval {
  status: 'approved' | 'rejected';
  remark: string;
}

// 统一导出所有类型
export * from './user.types';
export * from './bet.types';
export * from './order.types';
export * from './exchange.types';
export * from './game.types';
export * from './auth.types';
export * from './common.types';

// 基础接口定义
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// 其他通用类型... 