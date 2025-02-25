// src/index.ts
import express from 'express';
import cors from 'cors';  // 如果需要跨域支持
import dotenv from 'dotenv';  // 用于加载环境变量
import routes from './routes/index';  // 引入所有的路由配置
import { pool } from './utils/database';  // 引入路由
import bodyParser from 'body-parser'; // 如果需要进行数据库初始化检查等

// 加载环境变量
dotenv.config();

// 创建 Express 应用实例
const app = express();

// 使用中间件
app.use(cors());  // 允许跨域请求
app.use(express.json());  // 解析 JSON 请求体

// 配置路由
app.use('/api', routes);  // 所有路由都使用 `/api` 前缀

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // 可选：检查数据库连接
  pool.connect()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection failed:', err));
});
