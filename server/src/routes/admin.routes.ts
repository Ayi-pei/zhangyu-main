import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

// 用户管理
router.get('/users', (req, res, next) => {
  adminController.getUsers(req, res).catch(next);
});

router.post('/users', (req, res, next) => {
  adminController.createUser(req, res).catch(next);
});

router.put('/users/:id', (req, res, next) => {
  adminController.updateUser(req, res).catch(next);
});

router.delete('/users/:id', (req, res, next) => {
  adminController.deleteUser(req, res).catch(next);
});

// 投注管理
router.get('/betting-records', (req, res, next) => {
  adminController.getBettingRecords(req, res).catch(next);
});

router.put('/betting-records/:id', (req, res, next) => {
  adminController.updateBettingResult(req, res).catch(next);
});

// 交易管理
router.get('/transactions', (req, res, next) => {
  adminController.getTransactions(req, res).catch(next);
});

router.put('/transactions/:id', (req, res, next) => {
  adminController.processTransaction(req, res).catch(next);
});

// 高级搜索
router.get('/search', (req, res, next) => {
  adminController.search(req, res).catch(next);
});

// 仪表盘数据
router.get('/dashboard', (req, res, next) => {
  adminController.getDashboardData(req, res).catch(next);
});

export default router; 