import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { UpdateProfileSchema } from '../schemas/user.schema';

const router = Router();
const userController = new UserController();

router.use(authMiddleware); // 所有用户路由都需要认证

router.get('/me', 
  async (req, res, next) => {
    try {
      await userController.getCurrentUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/profile', 
  validateRequest(UpdateProfileSchema),
  async (req, res, next) => {
    try {
      await userController.updateProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/stats', 
  async (req, res, next) => {
    try {
      await userController.getUserStats(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/history', 
  async (req, res, next) => {
    try {
      await userController.getGameHistory(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 