import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const gameController = new GameController();

// 获取当前回合信息
router.get(
  '/current-round',
  authenticate,
  gameController.getCurrentRound.bind(gameController)
);

// 投注
router.post(
  '/bet',
  authenticate,
  gameController.placeBet.bind(gameController)
);

// 获取投注历史
router.get(
  '/bet-history',
  authenticate,
  gameController.getBetHistory.bind(gameController)
);

// 获取回合结果（用于测试）
router.get(
  '/round/:roundNumber',
  authenticate,
  gameController.getRoundResult.bind(gameController)
);

export default router; 