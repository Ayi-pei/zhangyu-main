import { Router } from 'express';
import { ExchangeController } from '../controllers/exchange.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { CreateExchangeSchema, UpdateExchangeStatusSchema } from '../schemas/exchange.schema';

const router = Router();
const exchangeController = new ExchangeController();

// 使用认证中间件
router.use(authMiddleware);

// 创建兑换记录
router.post('/',
  validateRequest(CreateExchangeSchema),
  async (req, res, next) => {
    try {
      await exchangeController.createExchange(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取兑换记录列表
router.get('/',
  async (req, res, next) => {
    try {
      await exchangeController.getExchanges(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 获取兑换记录详情
router.get('/:id',
  async (req, res, next) => {
    try {
      await exchangeController.getExchanges(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// 更新兑换记录状态
router.put('/:id/status',
  validateRequest(UpdateExchangeStatusSchema),
  async (req, res, next) => {
    try {
      await exchangeController.updateExchangeStatus(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 