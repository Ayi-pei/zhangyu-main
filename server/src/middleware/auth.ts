import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService, userService } from '../services';
import { ServiceError, UserRole } from '../types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 实现认证逻辑
}; 