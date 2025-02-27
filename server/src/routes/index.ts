import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import betRoutes from './betRoutes';
import adminRoutes from './adminRoutes';
import cardRoutes from './cardRoutes';
import exchangeRoutes from './exchangeRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// 注册路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bets', betRoutes);
router.use('/admin', adminRoutes);
router.use('/cards', cardRoutes);
router.use('/exchanges', exchangeRoutes);
router.use('/orders', orderRoutes);

export default router; 