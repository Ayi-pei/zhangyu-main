import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// 基础中间件
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 每个IP限制100个请求
});
app.use('/api', limiter);

// 路由
app.use('/api', routes);

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app; 