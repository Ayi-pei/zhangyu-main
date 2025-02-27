import { Router } from 'express';
import authRoutes from './authRoutes';
import exchangeRoutes from './exchangeRoutes';
import adminRoutes from './adminRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// 注册路由
router.use('/auth', authRoutes);
router.use('/exchange', exchangeRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);

export default router; 