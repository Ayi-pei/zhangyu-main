import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDatabase } from './config/database';
import { errorHandler } from './utils/error';
import { requestLogger } from './logger';
import routes from './routes';

const app = express();

// 初始化数据库
initDatabase();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// 路由
app.use('/api', routes);

// 错误处理
app.use(errorHandler);

export default app; 