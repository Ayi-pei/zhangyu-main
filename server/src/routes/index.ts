import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import gameRoutes from './game.routes';
import betRoutes from './bet.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 公开路由
router.use('/auth', authRoutes);

// 需要认证的路由
router.use('/user', authMiddleware.authenticate, userRoutes);
router.use('/game', authMiddleware.authenticate, gameRoutes);
router.use('/bet', authMiddleware.authenticate, betRoutes);

// 管理员路由
router.use('/admin', authMiddleware.authenticate, authMiddleware.requireAdmin, adminRoutes);

export default router; 