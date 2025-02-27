// FILEPATH: d:/ayi/zhangyu-main/server/src/middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 限制 100 个请求
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  }
});
