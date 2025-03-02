import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { CreateCardDto, ServiceResponse } from '../types';
import { ServiceError } from '../types';

export class CardService extends BaseService {
  async saveCardInfo(userId: string, data: CreateCardDto): ServiceResponse<PrismaTypes.CardWithUser> {
    try {
      const card = await this.prisma.card.create({
        data: {
          ...data,
          userId
        },
        include: {
          user: true
        }
      });

      return { success: true, data: card };
    } catch (error) {
      throw new ServiceError('Failed to save card', 500, error);
    }
  }

  async getCardsByUserId(userId: string): ServiceResponse<PrismaTypes.CardWithUser[]> {
    try {
      const cards = await this.prisma.card.findMany({
        where: { userId },
        include: {
          user: true
        }
      });

      return { success: true, data: cards };
    } catch (error) {
      throw new ServiceError('Failed to get cards', 500, error);
    }
  }

  async deleteCard(id: string, userId: string): ServiceResponse<void> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id }
      });

      if (!card) {
        throw new ServiceError('Card not found', 404);
      }

      if (card.userId !== userId) {
        throw new ServiceError('Unauthorized', 403);
      }

      await this.prisma.card.delete({
        where: { id }
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to delete card', 500, error);
    }
  }

  async validateCard(cardNumber: string): ServiceResponse<boolean> {
    try {
      // 实现卡号验证逻辑
      const isValid = /^[0-9]{16}$/.test(cardNumber);
      return { success: true, data: isValid };
    } catch (error) {
      throw new ServiceError('Failed to validate card', 500, error);
    }
  }
} 