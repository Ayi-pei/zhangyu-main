import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './utils/logger';
import { PrismaClient } from '@prisma/client';

// 创建 Express 应用实例
const app = express();
export const prisma = new PrismaClient();

// 中间件设置
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);
app.use(requestLogger);

// 路由设置
app.use('/api', routes);

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

export { app }; 