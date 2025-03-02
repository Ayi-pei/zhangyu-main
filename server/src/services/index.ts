import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

export const prisma = new PrismaClient();

export const authService = new AuthService();
export const userService = new UserService();

export function initializeServices() {
  // 在这里初始化所有服务
  return {
    prisma,
    authService,
    userService
  };
}

// 确保在应用退出时关闭数据库连接
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 