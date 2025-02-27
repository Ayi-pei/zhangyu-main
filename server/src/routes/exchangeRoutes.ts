import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { authenticateToken } from '../middleware/auth';
import { exchangeService } from '../services/services';
import { ExchangeSchema } from '../schemas/exchange.schema';

const router = Router();

router.post('/', 
  authenticateToken,
  validateRequest(ExchangeSchema),
  async (req, res, next) => {
    try {
      const { userId, cardId, amount } = req.body;
      const result = await exchangeService.processExchange(userId, cardId, amount);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const result = await exchangeService.getExchangeHistory(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 