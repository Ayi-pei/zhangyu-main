// FILEPATH: d:/ayi/zhangyu-main/server/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './utils/database';
import { User } from './models/User';
import { Bet } from './models/bet';
import userRoutes from './routes/userRoutes';
import betRoutes from './routes/betRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// 加载环境变量
dotenv.config();

// 创建 Express 应用实例
const app = express();

// 中间件设置
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);

// 路由设置
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);

// 404 处理
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

// 错误处理中间件
app.use(errorHandler);

// 同步数据库模型
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync({ alter: true }); // 在开发环境中使用 alter: true
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await syncDatabase();
});

// 优雅关闭
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export default app;
