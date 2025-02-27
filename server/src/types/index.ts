// FILEPATH: d:/ayi/zhangyu-main/server/src/types/index.ts

export * from './prisma';
export * from './dto';
export * from './enums';
export * from './responses';

// 通用错误类型
export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 通用分页类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  // 添加其他用户相关的属性
}

export interface Bet {
  id: string;
  userId: string;
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost';
  // 添加其他投注相关的属性
}

export interface Stats {
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  // 添加其他统计相关的属性
}

// DTO 接口
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  memberLevel?: string;
  credits?: number;
}

export interface CreateBetDto {
  amount: number;
  odds: number;
  gameId: string;
}

export interface CreateOrderDto {
  amount: number;
  type: 'RECHARGE' | 'WITHDRAW';
}

export interface CreateCardDto {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CreateExchangeDto {
  cardId: string;
  amount: number;
}

// 枚举类型
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum OrderType {
  RECHARGE = 'RECHARGE',
  WITHDRAW = 'WITHDRAW'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum BetStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST'
}

export enum ExchangeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// 服务响应类型
export type ServiceResponse<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

// 通用查询选项
export interface QueryOptions {
  include?: Record<string, boolean>;
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  skip?: number;
  take?: number;
}

// 缓存键类型
export type CacheKey = `user:${string}` | `bet:${string}` | `order:${string}`;

// 验证错误类型
export interface ValidationError {
  field: string;
  message: string;
}

// 服务层错误类型
export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
