// src/routes/betRoutes.ts
import express from 'express';
import { checkAuthorization } from '../services/authService';  // 假设你有认证服务
import { placeBet, getBetHistory } from '../services/betServices';

const router = express.Router();

router.post('/place', checkAuthorization, async (req, res) => {
  const { amount, gameId } = req.body;
  if (isNaN(amount) || amount <= 0 || !gameId) {
    return res.status(400).json({ success: false, message: '参数不合法' });
  }

  try {
    await placeBet(req.user.id, amount, gameId);
    res.json({ success: true, message: '投注成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '投注失败，请稍后再试' });
  }
});

router.get('/history', checkAuthorization, async (req, res) => {
  try {
    const history = await getBetHistory(req.user.id);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取投注历史失败' });
  }
});

export default router;
