import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../types';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 记录错误日志
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  // 记录错误指标
  metrics.errorCount.inc({
    path: req.path,
    method: req.method,
    type: error.constructor.name
  });

  // 处理业务错误
  if (error instanceof ServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.statusCode,
      details: error.details
    });
  }

  // 处理验证错误
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      code: 400,
      errors: error.errors
    });
  }

  // 处理未知错误
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? '服务器内部错误' : error.message,
    code: statusCode
  });
} 