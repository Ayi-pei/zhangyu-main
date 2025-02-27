import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { updateProfileSchema } from '../schemas/user.schema';

const router = Router();
const userController = new UserController();

router.use(authMiddleware); // 所有用户路由都需要认证

router.get('/me', userController.getCurrentUser);
router.put('/profile', 
  validateRequest(updateProfileSchema),
  userController.updateProfile
);
router.get('/stats', userController.getUserStats);
router.get('/history', userController.getGameHistory);

export default router; 