import { prisma } from '../utils/prisma';
import { IGameRound, IBet } from '../types';

export class GameService {
  async getCurrentRound(): Promise<IGameRound> {
    const now = new Date();
    const currentRound = await prisma.gameRound.findFirst({
      where: {
        endTime: { gt: now },
        status: 'active'
      }
    });

    if (!currentRound) {
      return this.createNewRound();
    }

    return currentRound;
  }

  private async createNewRound(): Promise<IGameRound> {
    const now = new Date();
    const endTime = new Date(now.getTime() + 180000); // 3分钟后

    return await prisma.gameRound.create({
      data: {
        roundNumber: this.generateRoundNumber(),
        startTime: now,
        endTime,
        status: 'active'
      }
    });
  }

  private generateRoundNumber(): string {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  }
} 