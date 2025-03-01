import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { OrderSchema } from '../schemas/order.schema';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware);

router.post('/', 
  validateRequest(OrderSchema),
  (req, res, next) => orderController.createOrder(req, res).catch(next)
);

router.get('/', 
  (req, res, next) => orderController.getOrders(req, res).catch(next)
);

router.get('/:id', 
  (req, res, next) => orderController.getOrderById(req, res).catch(next)
);

router.patch('/:id/status',
  (req, res, next) => orderController.updateOrderStatus(req, res).catch(next)
);

export default router; 