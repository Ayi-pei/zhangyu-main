import express from 'express';
import { checkAuthorization, saveCardInfo, getExchangeHistory } from '../services/services';
import { deductPoints, addExchangeRecord } from '../services/services';

const router = express.Router();

// 绑定银行卡接口
router.post('/bind-card', checkAuthorization, async (req, res) => {
  const { cardNumber, bank, cardHolder, exchangeCode } = req.body;
  if (!cardNumber || !bank || !cardHolder || !exchangeCode) {
    return res.status(400).json({ success: false, message: '缺少必要的参数' });
  }

  try {
    // 保存银行卡信息
    await saveCardInfo(req.user.id, cardNumber, bank, cardHolder, exchangeCode);
    res.json({ success: true, message: '银行卡绑定成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '绑定失败，请稍后再试' });
  }
});

// 积分兑换接口
router.post('/exchange', checkAuthorization, async (req, res) => {
  const { amount, verificationCode } = req.body;

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: '请输入有效的兑换积分数量' });
  }

  const user = req.user; // 获取当前用户信息
  if (user.points < amount) {
    return res.status(400).json({ success: false, message: '积分不足' });
  }

  try {
    // 扣除积分并记录兑换
    await deductPoints(user.id, amount);
    await addExchangeRecord(user.id, amount, verificationCode);

    res.json({ success: true, message: '兑换成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '兑换失败，请稍后再试' });
  }
});

// 查看积分历史接口
router.get('/exchange-history', checkAuthorization, async (req, res) => {
  try {
    const history = await getExchangeHistory(req.user.id);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取历史记录失败' });
  }
});

export default router;
