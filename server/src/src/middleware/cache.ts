import { createClient } from 'redis';
import { Request, Response, NextFunction } from 'express';
import { memoryCache } from '../utils/memoryCache';
import { logger } from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => logger.error('Redis Client Error:', err));

// 多级缓存中间件
export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      // 先检查内存缓存
      const memData = memoryCache.get(key);
      if (memData) {
        logger.debug('Memory cache hit:', key);
        return res.json(memData);
      }

      // 检查 Redis 缓存
      const redisData = await redisClient.get(key);
      if (redisData) {
        const data = JSON.parse(redisData);
        // 写入内存缓存
        memoryCache.set(key, data, duration);
        logger.debug('Redis cache hit:', key);
        return res.json(data);
      }

      // 修改 res.json 方法以缓存响应
      const originalJson = res.json;
      res.json = function(data) {
        // 同时写入两级缓存
        memoryCache.set(key, data, duration);
        redisClient.setEx(key, duration, JSON.stringify(data));
        logger.debug('Cache miss, storing data:', key);
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next(error);
    }
  };
};

// 清除缓存的方法
export const clearCache = async (pattern: string) => {
  try {
    // 清除内存缓存
    memoryCache.clear();
    
    // 清除 Redis 缓存
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    logger.info('Cache cleared for pattern:', pattern);
  } catch (error) {
    logger.error('Clear cache error:', error);
    throw error;
  }
}; 