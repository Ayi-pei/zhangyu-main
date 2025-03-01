import { BaseService } from './baseService';
import { ServiceError } from '../types';
import type { User, Profile, Bet, Order, Exchange, Prisma } from '@prisma/client';

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
} 