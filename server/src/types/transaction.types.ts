export interface ITransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bankCardId?: string;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
} 