import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { CardController } from '../controllers/card.controller';
import { CreateCardSchema } from '../schemas/card.schema';

const router = Router();
const cardController = new CardController();

router.use(authMiddleware);

router.post('/', 
  validateRequest(CreateCardSchema),
  (req, res, next) => cardController.createCard(req, res).catch(next)
);

router.get('/', 
  (req, res, next) => cardController.getCards(req, res).catch(next)
);

router.delete('/:id',
  (req, res, next) => cardController.deleteCard(req, res).catch(next)
);

export default router; 