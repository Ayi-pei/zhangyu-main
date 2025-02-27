// FILEPATH: d:/ayi/zhangyu-main/server/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IUser } from '../models/User';  // 假设我们从 User 模型中导出一个接口
import type { RateLimit } from 'express-rate-limit';
import type { HelmetOptions } from 'helmet';
import { authService, userService } from '../services';
import { ServiceError, UserRole } from '../types';

// 扩展 Express 的 Request 接口以包含 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// 添加 IP 黑名单检查
export const checkIpBlacklist = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip;
  // 实现 IP 黑名单检查逻辑
  next();
};

// 加强 token 验证
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ServiceError('No token provided', 401);
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new ServiceError('Invalid token', 401);
    }

    const result = await userService.getUserById(decoded.id);
    if (!result.success || !result.data) {
      throw new ServiceError('User not found', 401);
    }

    req.user = result.data;
    next();
  } catch (error) {
    if (error instanceof ServiceError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
}

export function checkAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
}

export function checkUser(req: Request, res: Response, next: NextFunction): void {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required.' });
  }
}
