import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();
const gameController = new GameController();

// 获取当前游戏回合信息
router.get('/current-round', (req, res, next) => {
  gameController.getCurrentRound(req, res).catch(next);
});

// 处理用户投注
router.post('/place-bet', (req, res, next) => {
  gameController.placeBet(req, res).catch(next);
});

// 结算回合
router.post('/settle-round/:roundNumber', (req, res, next) => {
  gameController.settleRound(req, res).catch(next);
});

// 获取用户投注历史
router.get('/bet-history', (req, res, next) => {
  gameController.getBetHistory(req, res).catch(next);
});

// 获取回合结果
router.get('/round-result/:roundNumber', (req, res, next) => {
  gameController.getRoundResult(req, res).catch(next);
});

export default router; 