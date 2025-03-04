import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator';
import { UpdateProfileSchema } from '../schemas/user.schema';

const router = Router();
const userController = new UserController();

router.use(authMiddleware.authenticate); // 所有用户路由都需要认证

router.get('/me', 
  async (req, res, next) => {
    try {
      await userController.getCurrentUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/profile', (req, res, next) => {
  userController.getProfile(req, res).catch(next);
});

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

router.get('/stats', (req, res, next) => {
  userController.getStats(req, res).catch(next);
});

router.get('/game-history', (req, res, next) => {
  userController.getGameHistory(req, res).catch(next);
});

router.post('/balance', (req, res, next) => {
  userController.updateBalance(req, res).catch(next);
});

export default router; 