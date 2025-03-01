import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './utils/logger';
import { PrismaClient } from '@prisma/client';
import { initializeServices } from './services';

// 创建 Express 应用实例
const app = express();
export const prisma = new PrismaClient();

// 基础安全中间件
app.use(helmet());
app.use(cors());

// 请求解析中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志和限流中间件
app.use(morgan('dev'));
app.use(requestLogger);
app.use(rateLimiter);

// 路由设置
app.use('/api', routes);

// 初始化服务
try {
  initializeServices();
} catch (error) {
  console.error('服务初始化失败:', error);
  process.exit(1);
}

// 404 处理
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist.'
  });
});

// 错误处理中间件
app.use(errorHandler);

// 优雅关闭
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export default app; 