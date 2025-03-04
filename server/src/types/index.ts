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
  cell?: (item: T) => any;
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

// 改为具名导出，以避免命名冲突
import { IBet, BetQueryParams } from './bet.types';
import { IGameBet, IGameRound, GameQueryParams } from './game.types';
import { IOrder, OrderQueryParams } from './order.types';
import { IExchange, ExchangeQueryParams } from './exchange.types';
import { PaginationParams, PaginatedResponse, SearchParams } from './common.types';

// 直接导出避免冲突的类型
export { 
  IBet, 
  BetQueryParams,
  IGameBet, 
  IGameRound, 
  GameQueryParams,
  IOrder, 
  OrderQueryParams,
  IExchange, 
  ExchangeQueryParams,
  PaginationParams, 
  PaginatedResponse, 
  SearchParams
};

// 保留其他可以安全通配符导出的模块
export * from './user.types';
export * from './auth.types';
export * from './transaction.types';
export * from './error';

// 基础接口定义
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

// 其他通用类型... 