import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { prisma } from '../utils/prisma';

export class BetController extends BaseController {
  async placeBet(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { type, amount, options } = req.body;
        const userId = req.user.id;

        // 检查用户余额
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user || user.balance < amount) {
          throw new Error('余额不足');
        }

        // 创建投注记录
        const bet = await prisma.bet.create({
          data: {
            userId,
            type,
            amount,
            options,
            status: 'pending'
          }
        });

        // 扣除用户余额
        await prisma.user.update({
          where: { id: userId },
          data: { balance: user.balance - amount }
        });

        return { bet };
      },
      '投注成功',
      '投注失败'
    );
  }

  async getBetHistory(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user.id;
        const { page = 1, pageSize = 10, type, status } = req.query;

        const where = {
          userId,
          ...(type && { type: String(type) }),
          ...(status && { status: String(status) })
        };

        const [total, bets] = await Promise.all([
          prisma.bet.count({ where }),
          prisma.bet.findMany({
            where,
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: bets,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取投注历史成功',
      '获取投注历史失败'
    );
  }

  async getBetDetail(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const userId = req.user.id;

        const bet = await prisma.bet.findFirst({
          where: { 
            id,
            userId
          }
        });

        if (!bet) {
          throw new Error('投注记录不存在');
        }

        return { bet };
      },
      '获取投注详情成功',
      '获取投注详情失败'
    );
  }

  async cancelBet(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const userId = req.user.id;

        const bet = await prisma.bet.findFirst({
          where: { 
            id,
            userId,
            status: 'pending'
          }
        });

        if (!bet) {
          throw new Error('投注记录不存在或无法取消');
        }

        // 更新投注状态
        const updatedBet = await prisma.bet.update({
          where: { id },
          data: { status: 'cancelled' }
        });

        // 退还用户余额
        await prisma.user.update({
          where: { id: userId },
          data: {
            balance: {
              increment: bet.amount
            }
          }
        });

        return { bet: updatedBet };
      },
      '取消投注成功',
      '取消投注失败'
    );
  }
} 