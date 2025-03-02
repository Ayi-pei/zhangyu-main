import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { prisma } from '../utils/prisma';

export class GameController extends BaseController {
  // 获取当前游戏回合信息
  async getCurrentRound(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const now = new Date();
        const currentRound = await prisma.gameRound.findFirst({
          where: {
            endTime: {
              gt: now
            },
            status: 'active'
          }
        });

        if (!currentRound) {
          // 创建新回合
          const duration = 180; // 3分钟
          const endTime = new Date(now.getTime() + duration * 1000);
          
          const newRound = await prisma.gameRound.create({
            data: {
              roundNumber: this.generateRoundNumber(),
              startTime: now,
              endTime,
              status: 'active'
            }
          });

          return { round: newRound, timeLeft: duration };
        }

        const timeLeft = Math.max(0, Math.floor((currentRound.endTime.getTime() - now.getTime()) / 1000));
        return { round: currentRound, timeLeft };
      },
      '获取当前回合信息成功',
      '获取当前回合信息失败'
    );
  }

  // 处理用户投注
  async placeBet(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { roundNumber, betType, betAmount } = req.body;
        const userId = req.user.id;

        return await prisma.$transaction(async (tx) => {
          // 检查回合是否有效
          const round = await tx.gameRound.findFirst({
            where: {
              roundNumber,
              status: 'active',
              endTime: {
                gt: new Date()
              }
            }
          });

          if (!round) {
            throw new Error('当前回合已结束或不存在');
          }

          // 检查用户余额
          const user = await tx.user.findUnique({
            where: { id: userId }
          });

          if (!user || user.balance < betAmount) {
            throw new Error('余额不足');
          }

          // 创建投注记录
          const bet = await tx.bet.create({
            data: {
              userId,
              roundNumber,
              betType,
              betAmount,
              status: 'pending'
            }
          });

          // 扣除用户余额
          await tx.user.update({
            where: { id: userId },
            data: {
              balance: {
                decrement: betAmount
              }
            }
          });

          return { bet };
        });
      },
      '投注成功',
      '投注失败'
    );
  }

  // 结算回合
  async settleRound(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { roundNumber } = req.params;

        return await prisma.$transaction(async (tx) => {
          // 获取回合信息
          const round = await tx.gameRound.findFirst({
            where: {
              roundNumber,
              status: 'active'
            },
            include: {
              bets: true
            }
          });

          if (!round) {
            throw new Error('回合不存在');
          }

          if (new Date() < round.endTime) {
            throw new Error('回合尚未结束');
          }

          // 生成结果
          const result = this.generateResult();

          // 更新回合状态和结果
          await tx.gameRound.update({
            where: { id: round.id },
            data: {
              status: 'completed',
              result
            }
          });

          // 结算所有投注
          for (const bet of round.bets) {
            const isWin = this.checkWin(bet.betType, result);
            const winAmount = isWin ? bet.betAmount * 2 : 0;

            // 更新投注状态
            await tx.bet.update({
              where: { id: bet.id },
              data: {
                status: 'settled',
                isWin,
                winAmount
              }
            });

            // 如果赢了，发放奖金
            if (isWin) {
              await tx.user.update({
                where: { id: bet.userId },
                data: {
                  balance: {
                    increment: winAmount
                  }
                }
              });
            }
          }

          return { round: { ...round, result } };
        });
      },
      '回合结算成功',
      '回合结算失败'
    );
  }

  // 获取用户投注历史
  async getBetHistory(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user.id;
        const { page = 1, pageSize = 10 } = req.query;

        const [bets, total] = await Promise.all([
          prisma.bet.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            include: {
              round: true
            }
          }),
          prisma.bet.count({
            where: { userId }
          })
        ]);

        return {
          bets,
          pagination: {
            total,
            page: Number(page),
            pageSize: Number(pageSize)
          }
        };
      },
      '获取投注历史成功',
      '获取投注历史失败'
    );
  }

  // 获取回合结果
  async getRoundResult(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { roundNumber } = req.params;

        const round = await prisma.gameRound.findUnique({
          where: { roundNumber },
          include: {
            bets: {
              where: { userId: req.user.id }
            }
          }
        });

        if (!round) {
          throw new Error('回合不存在');
        }

        return {
          round,
          userBets: round.bets
        };
      },
      '获取回合结果成功',
      '获取回合结果失败'
    );
  }

  private generateRoundNumber(): string {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  }

  private generateResult(): string[] {
    const possibleBigSmall = ['big', 'small'];
    const possibleOddEven = ['odd', 'even'];
    return [
      possibleBigSmall[Math.floor(Math.random() * 2)],
      possibleOddEven[Math.floor(Math.random() * 2)]
    ];
  }

  private checkWin(betType: string[], result: string[]): boolean {
    return betType.some(bet => result.includes(bet));
  }
} 