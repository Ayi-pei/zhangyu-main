import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { prisma } from '../utils/prisma';
import type { CreateExchangeDto, UpdateExchangeStatusDto } from '../schemas/exchange.schema';

export class ExchangeController extends BaseController {
  // 获取兑换记录
  async getExchanges(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { page = 1, pageSize = 10, status, startDate, endDate } = req.query;
        const userId = req.user?.id;

        const where = {
          userId,
          ...(status && { status: String(status) }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(String(startDate)),
              lte: new Date(String(endDate))
            }
          })
        };

        const [total, exchanges] = await Promise.all([
          prisma.exchange.count({ where }),
          prisma.exchange.findMany({
            where,
            include: {
              user: {
                select: {
                  id: true,
                  username: true
                }
              },
              card: {
                select: {
                  cardNumber: true,
                  cardHolder: true
                }
              }
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: exchanges,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取兑换记录成功',
      '获取兑换记录失败'
    );
  }

  // 发起兑换
  async createExchange(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { cardId, amount } = req.body as CreateExchangeDto;
        const userId = req.user?.id;

        if (!userId) {
          throw new Error('未授权的访问');
        }

        // 检查用户余额
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user || user.balance < amount) {
          throw new Error('余额不足');
        }

        // 检查卡片是否属于用户
        const card = await prisma.card.findFirst({
          where: {
            id: cardId,
            userId
          }
        });

        if (!card) {
          throw new Error('卡片不存在或不属于当前用户');
        }

        // 创建兑换记录并扣除余额
        const [exchange] = await prisma.$transaction([
          prisma.exchange.create({
            data: {
              userId,
              cardId,
              amount,
              status: 'PENDING'
            },
            include: {
              card: {
                select: {
                  cardNumber: true,
                  cardHolder: true
                }
              }
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              balance: {
                decrement: amount
              }
            }
          })
        ]);

        return { exchange };
      },
      '发起兑换成功',
      '发起兑换失败'
    );
  }

  // 更新兑换状态
  async updateExchangeStatus(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const { status } = req.body as UpdateExchangeStatusDto;
        const userId = req.user?.id;

        if (!userId) {
          throw new Error('未授权的访问');
        }

        const exchange = await prisma.exchange.findUnique({
          where: { id }
        });

        if (!exchange) {
          throw new Error('兑换记录不存在');
        }

        if (exchange.userId !== userId) {
          throw new Error('无权操作此兑换记录');
        }

        if (exchange.status !== 'PENDING') {
          throw new Error('只能更新待处理的兑换记录');
        }

        const updatedExchange = await prisma.exchange.update({
          where: { id },
          data: { status },
          include: {
            card: {
              select: {
                cardNumber: true,
                cardHolder: true
              }
            }
          }
        });

        // 如果兑换失败，退还余额
        if (status === 'FAILED') {
          await prisma.user.update({
            where: { id: userId },
            data: {
              balance: {
                increment: exchange.amount
              }
            }
          });
        }

        return { exchange: updatedExchange };
      },
      '更新兑换状态成功',
      '更新兑换状态失败'
    );
  }
} 