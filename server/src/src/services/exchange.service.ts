import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { CreateExchangeDto, ServiceResponse, ExchangeStatus } from '../types';
import { ServiceError } from '../types';

export class ExchangeService extends BaseService {
  async createExchange(userId: string, data: CreateExchangeDto): ServiceResponse<PrismaTypes.ExchangeWithUser> {
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

        // 创建兑换记录
        const exchange = await tx.exchange.create({
          data: {
            userId,
            amount: data.amount,
            cardId: data.cardId,
            status: ExchangeStatus.PENDING
          },
          include: {
            user: true,
            card: true
          }
        });

        return { success: true, data: exchange };
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to create exchange', 500, error);
    }
  }

  async getExchangeHistory(userId: string): ServiceResponse<PrismaTypes.ExchangeWithUser[]> {
    try {
      const exchanges = await this.prisma.exchange.findMany({
        where: { userId },
        include: {
          user: true,
          card: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: exchanges };
    } catch (error) {
      throw new ServiceError('Failed to get exchange history', 500, error);
    }
  }

  async updateExchangeStatus(id: string, status: ExchangeStatus): ServiceResponse<PrismaTypes.ExchangeWithUser> {
    try {
      const exchange = await this.prisma.exchange.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!exchange) {
        throw new ServiceError('Exchange not found', 404);
      }

      if (status === ExchangeStatus.FAILED) {
        await this.prisma.user.update({
          where: { id: exchange.userId },
          data: { credits: { increment: exchange.amount } }
        });
      }

      const updatedExchange = await this.prisma.exchange.update({
        where: { id },
        data: { status },
        include: {
          user: true,
          card: true
        }
      });

      return { success: true, data: updatedExchange };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to update exchange status', 500, error);
    }
  }
} 