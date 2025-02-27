// FILEPATH: d:/ayi/zhangyu-main/server/src/utils/router.ts

import { Router } from 'express';
import type { RequestHandler } from 'express';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { cardService, exchangeService } from '../services';
import type { IUser } from '../models/types';
import { z } from 'zod';
import type { CreateCardDto, CreateExchangeDto } from '../types';

// 扩展 Express 的 Request 类型
declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

const router = Router();

// 创建验证 schema
const bindCardSchema = z.object({
  cardNumber: z.string(),
  cardHolder: z.string(),
  expiryDate: z.string(),
  cvv: z.string()
});

const exchangeSchema = z.object({
  amount: z.number(),
  cardId: z.string()
});

// 类型安全的路由处理器
const bindCardHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const cardData: CreateCardDto = {
      cardNumber: req.body.cardNumber,
      cardHolder: req.body.cardHolder,
      expiryDate: req.body.expiryDate,
      cvv: req.body.cvv
    };
    
    const result = await cardService.saveCardInfo(req.user.id, cardData);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const exchangeHandler: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const exchangeData: CreateExchangeDto = {
      amount: req.body.amount,
      cardId: req.body.cardId
    };
    
    const result = await exchangeService.createExchange(req.user.id, exchangeData);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 路由定义
router.post(
  '/bind-card',
  authMiddleware as RequestHandler,
  validateRequest(bindCardSchema) as unknown as RequestHandler,
  bindCardHandler
);

router.post(
  '/exchange',
  authMiddleware as RequestHandler,
  validateRequest(exchangeSchema) as unknown as RequestHandler,
  exchangeHandler
);

export default router;
