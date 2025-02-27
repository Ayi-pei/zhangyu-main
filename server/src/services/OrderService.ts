import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { CreateOrderDto, ServiceResponse, OrderStatus, OrderType } from '../types';
import { ServiceError } from '../types';

export class OrderService extends BaseService {
  async createOrder(userId: string, data: CreateOrderDto): ServiceResponse<PrismaTypes.OrderWithUser> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      if (data.type === OrderType.WITHDRAW && user.credits < data.amount) {
        throw new ServiceError('Insufficient credits', 400);
      }

      const order = await this.prisma.order.create({
        data: {
          userId,
          amount: data.amount,
          type: data.type,
          status: OrderStatus.PENDING
        },
        include: {
          user: true
        }
      });

      return { success: true, data: order };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to create order', 500, error);
    }
  }

  async getOrderHistory(userId: string): ServiceResponse<PrismaTypes.OrderWithUser[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: orders };
    } catch (error) {
      throw new ServiceError('Failed to get order history', 500, error);
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): ServiceResponse<PrismaTypes.OrderWithUser> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!order) {
        throw new ServiceError('Order not found', 404);
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new ServiceError('Order cannot be updated', 400);
      }

      return await this.prisma.$transaction(async (tx) => {
        if (status === OrderStatus.APPROVED) {
          const amount = order.type === OrderType.RECHARGE ? order.amount : -order.amount;
          await tx.user.update({
            where: { id: order.userId },
            data: { credits: { increment: amount } }
          });
        }

        const updatedOrder = await tx.order.update({
          where: { id },
          data: { status },
          include: {
            user: true
          }
        });

        return { success: true, data: updatedOrder };
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to update order status', 500, error);
    }
  }
}
