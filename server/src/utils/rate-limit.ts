import rateLimit from 'express-rate-limit';

// 通用 API 限流
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100次请求
  message: {
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 登录接口特殊限制
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 5, // 每分钟最多5次登录尝试
  message: {
    error: '登录尝试次数过多，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 注册接口限制
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 3, // 每小时最多3次注册尝试
  message: {
    error: '注册尝试次数过多，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 敏感操作限制（如修改密码、重置密码等）
export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每小时最多5次尝试
  message: {
    error: '敏感操作尝试次数过多，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
}); 