import { CronJob } from 'cron';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export class GameScheduler {
  private static instance: GameScheduler;
  private roundSettlementJob: CronJob;
  private roundCreationJob: CronJob;
  private isRunning: boolean = false;

  private constructor() {
    // 每分钟检查一次是否有需要结算的回合
    this.roundSettlementJob = new CronJob('*/1 * * * *', this.settleExpiredRounds.bind(this));
    
    // 每3分钟创建一个新回合
    this.roundCreationJob = new CronJob('*/3 * * * *', this.createNewRound.bind(this));
  }

  public static getInstance(): GameScheduler {
    if (!GameScheduler.instance) {
      GameScheduler.instance = new GameScheduler();
    }
    return GameScheduler.instance;
  }

  start() {
    if (this.isRunning) {
      logger.warn('游戏定时任务已在运行中');
      return;
    }
    this.roundSettlementJob.start();
    this.roundCreationJob.start();
    this.isRunning = true;
    logger.info('游戏定时任务已启动');
  }

  stop() {
    if (!this.isRunning) {
      logger.warn('游戏定时任务未在运行');
      return;
    }
    this.roundSettlementJob.stop();
    this.roundCreationJob.stop();
    this.isRunning = false;
    logger.info('游戏定时任务已停止');
  }

  private async settleExpiredRounds() {
    try {
      const expiredRounds = await prisma.gameRound.findMany({
        where: {
          status: 'active',
          endTime: {
            lt: new Date()
          }
        },
        include: {
          bets: true
        }
      });

      for (const round of expiredRounds) {
        await prisma.$transaction(async (tx) => {
          // 生成结果
          const result = this.generateResult();

          // 更新回合状态
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
        });

        logger.info(`回合 ${round.roundNumber} 已结算`);
      }
    } catch (error) {
      logger.error('结算回合时发生错误:', error);
    }
  }

  private async createNewRound() {
    try {
      const now = new Date();
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

      logger.info(`新回合 ${newRound.roundNumber} 已创建`);
    } catch (error) {
      logger.error('创建新回合时发生错误:', error);
    }
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