// FILEPATH: d:/ayi/zhangyu-main/server/src/types/index.ts

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
