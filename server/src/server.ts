// FILEPATH: d:/ayi/zhangyu-main/server/src/index.ts

import dotenv from 'dotenv';
import { logger } from './logger';
import app from './app';
import { prisma } from './db';

// 加载环境变量
dotenv.config();

// 启动服务器
const PORT = process.env.PORT || 5432;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('数据库连接成功');

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error);
});
