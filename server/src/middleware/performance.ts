import { Request, Response, NextFunction } from 'express';
import { metrics } from '../utils/metrics';
import { alertService } from '../services/alertService';

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    // 记录响应时间
    metrics.responseTime.observe({ 
      method: req.method, 
      path: req.path 
    }, duration);

    // 检查慢请求
    if (duration > 1000) {
      alertService.sendAlert(
        'Slow Request Detected',
        `Request to ${req.method} ${req.path} took ${duration}ms`,
        'warning'
      );
    }
  });

  next();
}; 