// FILEPATH: d:/ayi/zhangyu-main/server/src/services/betService.ts

import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { CreateBetDto, BetStatus, ServiceResponse } from '../types';
import { ServiceError } from '../types';

export class BetService extends BaseService {
  async createBet(userId: string, data: CreateBetDto): ServiceResponse<PrismaTypes.BetWithUser> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.credits < data.amount) {
        throw new ServiceError('Insufficient credits', 400);
      }

      return await this.prisma.$transaction(async (tx) => {
        // 扣除用户积分
        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: data.amount } }
        });

        // 创建投注记录
        const bet = await tx.bet.create({
          data: {
            userId,
            amount: data.amount,
            odds: data.odds,
            gameId: data.gameId,
            status: BetStatus.PENDING
          },
          include: { user: true }
        });

        return { success: true, data: bet };
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to create bet', 500, error);
    }
  }

  async getBetHistory(userId: string): ServiceResponse<PrismaTypes.BetWithUser[]> {
    try {
      const bets = await this.prisma.bet.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: bets };
    } catch (error) {
      throw new ServiceError('Failed to get bet history', 500, error);
    }
  }

  async updateBetStatus(id: string, status: BetStatus): ServiceResponse<PrismaTypes.BetWithUser> {
    try {
      const bet = await this.prisma.bet.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!bet) {
        throw new ServiceError('Bet not found', 404);
      }

      if (status === BetStatus.WON) {
        await this.prisma.user.update({
          where: { id: bet.userId },
          data: { credits: { increment: bet.amount * bet.odds } }
        });
      }

      const updatedBet = await this.prisma.bet.update({
        where: { id },
        data: { status },
        include: { user: true }
      });

      return { success: true, data: updatedBet };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to update bet status', 500, error);
    }
  }
}
