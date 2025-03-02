export interface IExchange {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  cardId?: string;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeQueryParams {
  userId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} 