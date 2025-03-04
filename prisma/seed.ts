import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  // 清除现有数据
  await prisma.user.deleteMany();

  // 创建管理员用户 - 固定账号密码
  const adminPassword = await bcrypt.hash('admin888', 10);
  await prisma.user.create({
    data: {
      username: 'admin01',
      password: adminPassword,
      role: 'admin',
      balance: 0,
      credits: 0,
      member_level: 'ADMIN',
      reputation: 9999
    }
  });

  // 创建测试用户
  const userPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      username: 'testuser',
      password: userPassword,
      role: 'user',
      balance: 1000,
      credits: 100,
      member_level: 'NORMAL',
      reputation: 100
    }
  });

  console.log('数据库初始化完成');
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 