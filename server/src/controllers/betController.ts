// FILEPATH: d:/ayi/zhangyu-main/server/src/controllers/betController.ts

import { Request, Response } from 'express';
import { BetService } from '../services/betService';

const betService = new BetService();

export class BetController {
  async createBet(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { amount, gameId } = req.body;
      const bet = await betService.createBet(userId, amount, gameId);
      res.status(201).json(bet);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getBetHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const history = await betService.getBetsByUserId(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getBetById(req: Request, res: Response) {
    try {
      const betId = parseInt(req.params.id);
      const bet = await betService.getBetById(betId);
      if (bet) {
        res.json(bet);
      } else {
        res.status(404).json({ message: 'Bet not found' });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async settleBet(req: Request, res: Response) {
    try {
      const betId = parseInt(req.params.id);
      const { status } = req.body;
      const updatedBet = await betService.settleBet(betId, status);
      if (updatedBet) {
        res.json(updatedBet);
      } else {
        res.status(404).json({ message: 'Bet not found' });
      }
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
