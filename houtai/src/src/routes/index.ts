import { Router } from 'express';
import authRoute from './auth.routes';
import exchangeRoute from './exchange.routes';
import adminRoute from './admin.routes';
import orderRoute from './order.routes';
import userRoute from './user.routes';
import betRoute from './bet.routes';
import cardRoute from './card.routes';
import gameRoutes from './game.routes';

const router = Router();

// 注册路由
router.use('/auth', authRoute);
router.use('/exchange', exchangeRoute);
router.use('/admin', adminRoute);
router.use('/orders', orderRoute);
router.use('/users', userRoute);
router.use('/bets', betRoute);
router.use('/cards', cardRoute);
router.use('/game', gameRoutes);

export default router; 