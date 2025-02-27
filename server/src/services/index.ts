import { AuthService } from './authService';
import { UserService } from './userService';
import { BetService } from './betService';
import { CardService } from './cardService';
import { ExchangeService } from './exchangeService';
import { OrderService } from './orderService';

// 创建服务实例
export const authService = new AuthService();
export const userService = new UserService();
export const betService = new BetService();
export const cardService = new CardService();
export const exchangeService = new ExchangeService();
export const orderService = new OrderService();

// 导出服务类
export {
  AuthService,
  UserService,
  BetService,
  CardService,
  ExchangeService,
  OrderService
}; 