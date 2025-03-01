export interface IUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'banned';
  level: {
    level: number;
    title: string;
    color: string;
  };
  creditScore: number;
  balance: number;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserUpdate extends Partial<Omit<IUser, 'id'>> {
  id: string;
}

export interface IUserExport {
  id: string;
  username: string;
  role: string;
  status: string;
  level: {
    level: number;
    title: string;
    color: string;
  };
  creditScore: number;
  balance: number;
  totalBets: number;
  totalTransactions: number;
  createdAt: Date;
} 