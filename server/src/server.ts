// FILEPATH: d:/ayi/zhangyu-main/server/src/index.ts

import * as dotenv from 'dotenv';
import { app } from './app';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
