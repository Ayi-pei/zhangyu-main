export interface IGameRound {
  id: string;
  roundNumber: string;
  startTime: Date;
  endTime: Date;
  result?: number;
  status: 'pending' | 'active' | 'completed';
}

export interface IBet {
  id: string;
  userId: string;
  roundNumber: string;
  betType: 'big' | 'small' | 'odd' | 'even';
  amount: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: Date;
} 