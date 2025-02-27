import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { orderService } from '../services';
import { z } from 'zod';

const router = Router();

const orderSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['RECHARGE', 'WITHDRAW'])
});

router.use(authMiddleware);

router.post('/', validateRequest(orderSchema), async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await orderService.getOrderHistory(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 