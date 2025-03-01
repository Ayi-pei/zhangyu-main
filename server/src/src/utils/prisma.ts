import { PrismaClient } from '@prisma/client';

// 创建 Prisma 客户端实例
export const prisma = new PrismaClient();

// 错误处理
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error('Prisma Error:', error);
    throw error;
  }
}); 