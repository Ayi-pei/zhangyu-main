import { BaseService } from './baseService';
import { ServiceError } from '../types';
import type { User, Profile, Bet, Order, Exchange, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { IUser, IUserStats, IBankCard } from '../types';

export class UserService extends BaseService {
  async getProfile(userId: string) {
    const user = await this.findOne<User & { 
      profile: Profile;
      bets: Bet[];
      orders: Order[];
      exchanges: Exchange[];
    }>(this.prisma.user, 
      { id: userId },
      {
        profile: true,
        bets: true,
        orders: true,
        exchanges: true
      }
    );

    if (!user) {
      throw new ServiceError('用户不存在', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  async updateProfile(userId: string, data: {
    username?: string;
    email?: string;
    avatar?: string;
    bio?: string;
  }) {
    const user = await this.update<User>(
      this.prisma.user,
      { id: userId },
      {
        username: data.username,
        email: data.email,
        profile: {
          upsert: {
            create: { avatar: data.avatar, bio: data.bio },
            update: { avatar: data.avatar, bio: data.bio }
          }
        }
      },
      { profile: true }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  async getStats(userId: string) {
    const [bets, exchanges, orders] = await Promise.all([
      this.prisma.bet.count({ where: { userId } }),
      this.prisma.exchange.count({ where: { userId } }),
      this.prisma.order.count({ where: { userId } })
    ]);

    return {
      stats: {
        totalBets: bets,
        totalExchanges: exchanges,
        totalOrders: orders
      }
    };
  }

  async getGameHistory(userId: string, page: number = 1, pageSize: number = 10) {
    return this.paginate(this.prisma.bet, {
      page,
      pageSize,
      where: { userId },
      include: { game: true }
    });
  }

  async updateBalance(userId: string, amount: number, type: 'increment' | 'decrement') {
    return this.withTransaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new ServiceError('用户不存在', 404);
      }

      if (type === 'decrement' && user.balance < amount) {
        throw new ServiceError('余额不足', 400);
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            [type]: amount
          }
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return { user: userWithoutPassword };
    });
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bankCards: true,
        bets: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }

  async getUserStats(userId: string): Promise<IUserStats> {
    const bets = await prisma.bet.findMany({
      where: { userId }
    });

    const totalBets = bets.length;
    const wonBets = bets.filter(bet => bet.status === 'won').length;
    const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;

    return {
      totalBets,
      winRate,
      totalWinAmount: bets.reduce((acc, bet) => 
        bet.status === 'won' ? acc + bet.amount * 2 : acc, 0),
      totalBetAmount: bets.reduce((acc, bet) => acc + bet.amount, 0),
      recentResults: bets.slice(0, 5).map(bet => ({
        date: bet.createdAt.toISOString(),
        result: bet.status === 'won' ? 'win' : 'lose',
        amount: bet.amount
      }))
    };
  }
} 