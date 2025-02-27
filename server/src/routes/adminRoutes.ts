import { Router } from 'express';
import { authMiddleware, checkAdmin, authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { orderService, exchangeService } from '../services';
import { OrderStatus, ExchangeStatus, UserRole } from '../types';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);
router.use(checkAdmin);
router.use(authenticateToken);
router.use(checkRole(UserRole.ADMIN));

const statusSchema = z.object({
  status: z.string()
});

router.patch('/orders/:id/status', validateRequest(statusSchema), async (req, res, next) => {
  try {
    const result = await orderService.updateOrderStatus(req.params.id, req.body.status as OrderStatus);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/exchanges/:id/status', validateRequest(statusSchema), async (req, res, next) => {
  try {
    const result = await exchangeService.updateExchangeStatus(req.params.id, req.body.status as ExchangeStatus);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    // 管理员获取用户列表的逻辑
    res.json({ message: '获取用户列表成功' });
  } catch (error) {
    next(error);
  }
});

export default router; 