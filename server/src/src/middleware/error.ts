import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 记录错误
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // 处理不同类型的错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'ValidationError',
      message: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'UnauthorizedError',
      message: '未授权的访问'
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'NotFoundError',
      message: '资源未找到'
    });
  }

  // 默认错误响应
  res.status(500).json({
    error: 'InternalServerError',
    message: '服务器内部错误'
  });
}; 