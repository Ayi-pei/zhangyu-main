export interface IGameBet {
  id: string;
  userId: string;
  roundNumber: string;
  betType: 'big' | 'small' | 'odd' | 'even';
  amount: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: Date;
}

export interface IGameRound {
  id: string;
  roundNumber: string;
  startTime: Date;
  endTime: Date;
  result?: number;
  status: 'pending' | 'active' | 'completed';
}

export interface GameQueryParams {
  roundNumber?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
} 