export interface IUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
  balance: number;
  creditScore: number;
  level: {
    level: 1 | 2 | 3;
    title: string;
    stars: number;
  };
  status: 'active' | 'frozen' | 'deleted';
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserStats {
  totalBets: number;
  winRate: number;
  totalWinAmount: number;
  totalBetAmount: number;
  recentResults: Array<{
    date: string;
    result: 'win' | 'lose';
    amount: number;
  }>;
}

export interface IBankCard {
  id: string;
  userId: string;
  cardNumber: string;
  bankName: string;
  holderName: string;
  isDefault: boolean;
} 