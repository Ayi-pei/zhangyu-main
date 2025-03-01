// FILEPATH: d:/ayi/zhangyu-main/server/src/index.ts

import dotenv from 'dotenv';
import { logger } from './utils/logger';
import app from './app';

// 加载环境变量
dotenv.config();

// 启动服务器
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  logger.error('未处理的 Promise 拒绝:', error);
});
