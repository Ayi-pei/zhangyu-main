import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validator';
import { loginSchema, registerSchema } from '../schemas/auth';

const router = Router();
const authController = new AuthController();

// 包装控制器方法以确保正确的类型
const wrapHandler = (handler: (req: Request, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

router.post(
  '/login',
  validateRequest(loginSchema),
  wrapHandler(authController.login.bind(authController))
);

router.post(
  '/register',
  validateRequest(registerSchema),
  wrapHandler(authController.register.bind(authController))
);

export default router; 