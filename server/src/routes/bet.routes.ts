import { Router } from 'express';
import { BetController } from '../controllers/bet.controller';
import { validateRequest } from '../middleware/validator';
import { CreateBetSchema } from '../schemas/bet.schema';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const betController = new BetController();

router.use(authMiddleware.authenticate);

router.post('/', 
  validateRequest(CreateBetSchema),
  (req, res, next) => betController.placeBet(req, res).catch(next)
);

router.get('/', 
  (req, res, next) => betController.getBetHistory(req, res).catch(next)
);

router.get('/:id', 
  (req, res, next) => betController.getBetDetail(req, res).catch(next)
);

router.post('/:id/cancel',
  (req, res, next) => betController.cancelBet(req, res).catch(next)
);

export default router; 