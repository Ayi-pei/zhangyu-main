import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, checkAdmin } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// 使用认证中间件
router.use(authMiddleware);
router.use(checkAdmin);

// 搜索功能
router.get('/search', (req: Request, res: Response, next: NextFunction) => {
  adminController.search(req, res).catch(next);
});

// 获取未来开奖结果
router.get('/lottery/future', (req: Request, res: Response, next: NextFunction) => {
  adminController.getFutureLotteryResults(req, res).catch(next);
});

// 用户管理
router.put('/users/:userId/level', (req: Request, res: Response, next: NextFunction) => {
  adminController.updateUserLevel(req, res).catch(next);
});

router.put('/users/:userId/credit-score', (req: Request, res: Response, next: NextFunction) => {
  adminController.updateCreditScore(req, res).catch(next);
});

router.get('/dashboard', (req: Request, res: Response, next: NextFunction) => {
  adminController.getDashboardData(req, res).catch(next);
});

router.post('/users/batch-delete', (req: Request, res: Response, next: NextFunction) => {
  adminController.batchDeleteUsers(req, res).catch(next);
});

router.post('/users/batch-update', (req: Request, res: Response, next: NextFunction) => {
  adminController.batchUpdateUsers(req, res).catch(next);
});

router.get('/users/export', (req: Request, res: Response, next: NextFunction) => {
  adminController.exportUsers(req, res).catch(next);
});

export default router; 