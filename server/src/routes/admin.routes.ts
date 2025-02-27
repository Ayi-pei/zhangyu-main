import { Router } from 'express';

const router = Router();

router.put('/users/:userId/level', adminController.updateUserLevel);
router.put('/users/:userId/credit-score', adminController.updateCreditScore);
router.get('/dashboard', adminController.getDashboardData);
router.post('/users/batch-delete', adminController.batchDeleteUsers);
router.post('/users/batch-update', adminController.batchUpdateUsers);
router.get('/users/export', adminController.exportUsers);

export default router; 