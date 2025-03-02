import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validator';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// 注册路由
router.post('/register', 
  validateRequest(RegisterSchema),
  (req, res, next) => {
    authController.register(req, res).catch(next);
  }
);

// 登录路由
router.post('/login', 
  validateRequest(LoginSchema),
  (req, res, next) => {
    authController.login(req, res).catch(next);
  }
);

// 刷新令牌路由
router.post('/refresh-token', 
  (req, res, next) => {
    authController.refreshToken(req, res).catch(next);
  }
);

// 登出路由
router.post('/logout', 
  (req, res, next) => {
    authController.logout(req, res).catch(next);
  }
);

router.get('/profile', authMiddleware.authenticate, authController.getProfile);

router.post('/forgot-password',
  validateRequest(ForgotPasswordSchema),
  (req, res) => authController.forgotPassword(req, res)
);

router.post('/reset-password',
  validateRequest(ResetPasswordSchema),
  (req, res) => authController.resetPassword(req, res)
);

export default router; 