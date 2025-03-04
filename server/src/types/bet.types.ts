export interface IBet {
  id: string;
  userId: string;
  amount: number;
  type: string;
  options: string[];
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  result?: string;
}

export interface BetQueryParams {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
} 