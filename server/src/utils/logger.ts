import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import path from 'path';

const logDir = 'logs';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // 错误日志
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    // 普通日志
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 扩展 Response 接口以包含所需属性
declare module 'express-serve-static-core' {
  interface Response {
    on(event: string, listener: Function): this;
    statusCode: number;
  }
  interface Request {
    ip: string;
  }
}

// 请求日志中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // 记录请求开始
  logger.info({
    type: 'request',
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // 响应结束时记录
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      type: 'response',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

export { logger }; 