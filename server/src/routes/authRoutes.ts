import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { AuthService } from '../services/authService';
import { CreateUserSchema, LoginSchema } from '../schemas/auth.schema';

const router = Router();
const authService = new AuthService();

// 用户注册
router.post('/register',
  validateRequest(CreateUserSchema),
  async (req, res, next) => {
    try {
      const result = await authService.createUser(req.body);
      if (result.success) {
        const token = authService.generateToken(result.data);
        res.json({
          user: result.data,
          token
        });
      } else {
        res.status(400).json({ error: '用户创建失败' });
      }
    } catch (error) {
      next(error);
    }
  }
);

// 用户登录
router.post('/login',
  validateRequest(LoginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.authenticateUser(email, password);
      if (result.success) {
        const token = authService.generateToken(result.data);
        res.json({
          user: result.data,
          token
        });
      } else {
        res.status(401).json({ error: '登录失败' });
      }
    } catch (error) {
      next(error);
    }
  }
);

// 刷新token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供token' });
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'token无效' });
    }

    const result = await authService.authenticateUser(decoded.email, '');
    if (result.success) {
      const newToken = authService.refreshToken(result.data);
      res.json({ token: newToken });
    } else {
      res.status(401).json({ error: '刷新token失败' });
    }
  } catch (error) {
    next(error);
  }
});

export default router; 