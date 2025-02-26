// FILEPATH: d:/ayi/zhangyu-main/server/src/utils/router.ts

import express, { Request, Response, NextFunction } from 'express';
import { checkAuthorization } from '../middleware/auth';
import { saveCardInfo, getExchangeHistory, deductPoints, addExchangeRecord } from '../services/services';

const router = express.Router();

// 定义请求体的接口
interface BindCardRequest {
  cardNumber: string;
  bank: string;
  cardHolder: string;
  exchangeCode: string;
}

interface ExchangeRequest {
  amount: number;
  verificationCode: string;
}

// 绑定银行卡接口
router.post('/bind-card', checkAuthorization, async (req: Request<{}, {}, BindCardRequest>, res: Response, next: NextFunction) => {
  const { cardNumber, bank, cardHolder, exchangeCode } = req.body;
  if (!cardNumber || !bank || !cardHolder || !exchangeCode) {
    return res.status(400).json({ success: false, message: '缺少必要的参数' });
  }

  try {
    // 保存银行卡信息
    await saveCardInfo(req.user!.id, cardNumber, bank, cardHolder, exchangeCode);
    res.json({ success: true, message: '银行卡绑定成功' });
  } catch (error) {
    next(error);
  }
});

// 积分兑换接口
router.post('/exchange', checkAuthorization, async (req: Request<{}, {}, ExchangeRequest>, res: Response, next: NextFunction) => {
  const { amount, verificationCode } = req.body;

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: '请输入有效的兑换积分数量' });
  }

  const user = req.user!;
  if (user.points < amount) {
    return res.status(400).json({ success: false, message: '积分不足' });
  }

  try {
    // 扣除积分并记录兑换
    await deductPoints(user.id, amount);
    await addExchangeRecord(user.id, amount, verificationCode);

    res.json({ success: true, message: '兑换成功' });
  } catch (error) {
    next(error);
  }
});

// 查看积分历史接口
router.get('/exchange-history', checkAuthorization, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await getExchangeHistory(req.user!.id);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
});

export default router;
