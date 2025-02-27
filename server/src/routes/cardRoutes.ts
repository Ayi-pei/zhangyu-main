import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { cardService } from '../services';
import { z } from 'zod';

const router = Router();

const cardSchema = z.object({
  cardNumber: z.string(),
  cardHolder: z.string(),
  expiryDate: z.string(),
  cvv: z.string()
});

router.use(authMiddleware);

router.post('/', validateRequest(cardSchema), async (req, res, next) => {
  try {
    const result = await cardService.saveCardInfo(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await cardService.getCardsByUserId(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await cardService.deleteCard(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 