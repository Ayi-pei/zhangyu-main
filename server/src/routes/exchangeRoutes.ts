import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { exchangeService } from '../services';
import { z } from 'zod';

const router = Router();

const exchangeSchema = z.object({
  amount: z.number().positive(),
  cardId: z.string()
});

router.use(authMiddleware);

router.post('/', validateRequest(exchangeSchema), async (req, res, next) => {
  try {
    const result = await exchangeService.createExchange(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await exchangeService.getExchangeHistory(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 