// FILEPATH: d:/ayi/zhangyu-main/server/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/userRoutes';
import { betRouter } from './routes/betRoutes';
import type { PrismaTypes } from '../prisma';

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/users', userRouter);
app.use('/api/bets', betRouter);

// 根路由
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Betting API');
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).send('Sorry, that route does not exist.');
});

declare global {
  namespace Express {
    interface Request {
      user: PrismaTypes.UserWithRelations;
    }
  }
}

export {};

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
