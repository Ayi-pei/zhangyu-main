import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import { getUserInfo, updatePoints, getUserExchangeHistory, bindUserCard, updatePlayerStats } from '../controllers/userController';

const router = express.Router();

// 获取用户信息
router.get('/user-info', authMiddleware, getUserInfo);

// 更新用户积分
router.post('/update-points', authMiddleware, updatePoints);

// 获取用户兑换历史
router.get('/exchange-history', authMiddleware, getUserExchangeHistory);

// 绑定银行卡
router.post('/bind-card', authMiddleware, bindUserCard);

// **更新玩家信誉值和会员等级（仅限管理员）**
router.put('/user/update-stats', authMiddleware, adminMiddleware, updatePlayerStats);

export default router;

