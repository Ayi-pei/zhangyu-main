import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';

export const monitorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;

  // 记录请求计数
  metrics.requestCount.inc({ method, path });

  // 记录响应时间
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.responseTime.observe({ method, path }, duration);
    
    // 记录状态码
    metrics.statusCodes.inc({ 
      method, 
      path, 
      code: res.statusCode.toString() 
    });

    // 记录大于 1s 的慢请求
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method,
        path,
        duration,
        statusCode: res.statusCode
      });
    }
  });

  next();
}; 