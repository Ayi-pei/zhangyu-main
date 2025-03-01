import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

async function initAdmin() {
  try {
    // 检查管理员账号是否已存在
    const existingAdmin = await prisma.user.findFirst({
      where: { username: 'admin01' }
    });

    if (existingAdmin) {
      console.log('管理员账号已存在');
      return;
    }

    // 创建管理员账号
    const hashedPassword = await hashPassword('admins01');
    await prisma.user.create({
      data: {
        username: 'admin01',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        level: {
          level: 999,
          title: '超级管理员',
          color: '#ff0000'
        }
      }
    });

    console.log('管理员账号创建成功');
  } catch (error) {
    console.error('创建管理员账号失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initAdmin(); 