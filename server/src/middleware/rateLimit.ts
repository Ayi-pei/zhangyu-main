import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 100, // 限制每个IP 100次请求
  message: {
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 登录接口特殊限制
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 每分钟最多5次登录尝试
  message: {
    error: '登录尝试次数过多，请稍后再试'
  }
}); 