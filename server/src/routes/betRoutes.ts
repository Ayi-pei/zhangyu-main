// FILEPATH: d:/ayi/zhangyu-main/server/src/routes/betRoutes.ts

import express from 'express';
import { checkAuthorization } from '../services/authService';
import { betService, BetStatus } from '../models/bet';

const router = express.Router();

router.post('/', checkAuthorization, async (req, res) => {
  try {
    const { amount, gameId } = req.body;
    const userId = req.user!.id;  // 假设 checkAuthorization 中间件已经添加了 user 属性
    const bet = await betService.createBet(userId, amount, 1, gameId);  // 假设 odds 为 1
    res.status(201).json(bet);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'An unknown error occurred' });
    }
  }
});

router.get('/history', checkAuthorization, async (req, res) => {
  try {
    const history = await betService.getBetsByUserId(req.user!.id);
    res.json({ success: true, history });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'An unknown error occurred' });
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bet = await betService.getBetById(Number(req.params.id));
    if (bet) {
      res.json(bet);
    } else {
      res.status(404).json({ message: 'Bet not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBet = await betService.updateBetStatus(Number(req.params.id), status as BetStatus);
    if (updatedBet) {
      res.json(updatedBet);
    } else {
      res.status(404).json({ message: 'Bet not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await betService.cancelBet(Number(req.params.id));
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Bet not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
