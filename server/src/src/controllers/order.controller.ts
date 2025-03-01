import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { prisma } from '../utils/prisma';

export class OrderController extends BaseController {
  // 获取订单列表
  async getOrders(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { page = 1, pageSize = 10, status, startDate, endDate } = req.query;

        const where = {
          ...(status && { status: String(status) }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(String(startDate)),
              lte: new Date(String(endDate))
            }
          })
        };

        const [total, orders] = await Promise.all([
          prisma.order.count({ where }),
          prisma.order.findMany({
            where,
            include: { user: true },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: orders,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取订单列表成功',
      '获取订单列表失败'
    );
  }

  // 创建订单
  async createOrder(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { userId, items, totalAmount } = req.body;

        const order = await prisma.order.create({
          data: {
            userId,
            items,
            totalAmount,
            status: 'pending'
          }
        });

        return { order };
      },
      '创建订单成功',
      '创建订单失败'
    );
  }

  // 更新订单状态
  async updateOrderStatus(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
          where: { id },
          data: { status }
        });

        return { order };
      },
      '更新订单状态成功',
      '更新订单状态失败'
    );
  }
} 