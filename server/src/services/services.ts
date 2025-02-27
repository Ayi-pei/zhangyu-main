// FILEPATH: d:/ayi/zhangyu-main/server/src/server.ts

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from '../routes/auth';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 连接到 MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// 路由
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const prisma = new PrismaClient();

interface CardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  userId: string;
}

export const cardService = {
  async saveCardInfo(data: CardInfo) {
    return prisma.card.create({
      data,
      include: {
        user: true // 包含用户信息在返回结果中
      }
    });
  }
};

export const exchangeService = {
  async processExchange(userId: string, cardId: string, amount: number) {
    return prisma.$transaction(async (tx: PrismaClient) => {
      // 先检查用户是否存在并获取用户信息
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      // 检查用户积分是否足够
      if (user.credits < amount) {
        throw new Error('用户积分不足');
      }

      // 更新用户积分
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } }
      });

      // 创建兑换记录
      const exchange = await tx.exchange.create({
        data: {
          userId,
          cardId,
          amount,
          status: 'PENDING'
        }
      });

      return exchange;
    });
  }
};
