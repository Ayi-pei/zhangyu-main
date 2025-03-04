import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/auth.types';
import { AppError } from '../middleware/error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = {
  authenticate: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = {
        id: decoded.userId,
        role: decoded.role
      };
      next();
    } catch (error) {
      res.status(401).json({ message: '无效的认证令牌' });
    }
  },

  requireAdmin: (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' });
    }
    next();
  }
}; 