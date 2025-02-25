// src/routes/index.ts
import express from 'express';
import betRoutes from './betRoutes';  // 假设你有一个 betRoutes.ts 文件
import cardRoutes from './userRoutes';  // 假设你有一个 cardRoutes.ts 文件
import exchangeRoutes from './exchangeRoutes';  // 假设你有一个 exchangeRoutes.ts 文件
import userRoutes from './userRoutes';  // 假设你有一个 userRoutes.ts 文件

const router = express.Router();

// 挂载不同的路由到不同的路径
router.use('/bets', betRoutes);  // 处理与投注相关的请求
router.use('/cards', cardRoutes);  // 处理银行卡绑定相关的请求
router.use('/exchange', exchangeRoutes);  // 处理积分兑换相关的请求
router.use('/users', userRoutes);  // 处理用户管理相关的请求

// 可以根据需求添加更多的路由

export default router;
