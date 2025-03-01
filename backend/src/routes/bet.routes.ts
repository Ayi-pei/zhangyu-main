import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { BetController } from '../controllers/bet.controller';
import { CreateBetSchema } from '../schemas/bet.schema';

const router = Router();
const betController = new BetController();

router.use(authMiddleware);

router.post('/', 
  validateRequest(CreateBetSchema),
  (req, res, next) => betController.createBet(req, res).catch(next)
);

router.get('/', 
  (req, res, next) => betController.getBets(req, res).catch(next)
);

router.get('/:id', 
  (req, res, next) => betController.getBetById(req, res).catch(next)
);

router.patch('/:id/status',
  (req, res, next) => betController.updateBetStatus(req, res).catch(next)
);

router.delete('/:id',
  (req, res, next) => betController.cancelBet(req, res).catch(next)
);

export default router; 