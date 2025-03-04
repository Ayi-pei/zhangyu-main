export interface CreateUserDto {
  email: string;
  password: string;
  username: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  username?: string;
}

export interface CreateCardDto {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CreateBetDto {
  amount: number;
  odds: number;
  gameId: string;
}

export interface CreateExchangeDto {
  amount: number;
  cardId: string;
}

export interface CreateOrderDto {
  amount: number;
  type: 'RECHARGE' | 'WITHDRAW';
}

export interface UpdateProfileDto {
  avatar?: string;
  bio?: string;
}

export interface UserStatsDto {
  credits: number;
  memberLevel: string;
  reputation: number;
}

export interface OrderDto {
  amount: number;
  type: 'RECHARGE' | 'WITHDRAW';
}

export interface BetDto {
  amount: number;
  odds: number;
  gameId: string;
} 