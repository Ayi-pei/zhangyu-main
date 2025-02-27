import { Router } from 'express';
import { authMiddleware, checkAdmin } from '../middleware/auth';
import { orderService, exchangeService } from '../services';
import { OrderStatus, ExchangeStatus } from '../types';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);
router.use(checkAdmin);

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

export default router; 