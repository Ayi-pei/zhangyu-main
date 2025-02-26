// FILEPATH: d:/ayi/zhangyu-main/server/src/services/betService.ts

import { Bet, BetStatus } from '../models/bet';

export class BetService {
  async createBet(userId: number, amount: number, odds: number): Promise<Bet> {
    try {
      const bet = await Bet.create({
        userId,
        amount,
        odds,
        status: BetStatus.PENDING
      });
      return bet;
    } catch (error) {
      throw new Error(`Failed to create bet: ${error.message}`);
    }
  }

  async getBetById(id: number): Promise<Bet | null> {
    try {
      const bet = await Bet.findByPk(id);
      return bet;
    } catch (error) {
      throw new Error(`Failed to get bet: ${error.message}`);
    }
  }

  async getBetsByUserId(userId: number): Promise<Bet[]> {
    try {
      const bets = await Bet.findAll({ where: { userId } });
      return bets;
    } catch (error) {
      throw new Error(`Failed to get bets for user: ${error.message}`);
    }
  }

  async updateBetStatus(id: number, status: BetStatus): Promise<Bet | null> {
    try {
      const bet = await Bet.findByPk(id);
      if (!bet) {
        return null;
      }
      bet.status = status;
      await bet.save();
      return bet;
    } catch (error) {
      throw new Error(`Failed to update bet status: ${error.message}`);
    }
  }

  async deleteBet(id: number): Promise<boolean> {
    try {
      const result = await Bet.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw new Error(`Failed to delete bet: ${error.message}`);
    }
  }

  async calculateWinnings(betId: number): Promise<number> {
    try {
      const bet = await this.getBetById(betId);
      if (!bet || bet.status !== BetStatus.WON) {
        return 0;
      }
      return bet.amount * bet.odds;
    } catch (error) {
      throw new Error(`Failed to calculate winnings: ${error.message}`);
    }
  }
}
