export interface CreateExchangeDto {
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw';
} 