import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

const orderService = new OrderService();

export class OrderController {
  // 提交充值订单
  async submitRechargeOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { amount } = req.body;
      const order = await orderService.submitRecharge(userId, amount);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // 管理员更新充值订单状态
  async updateRechargeOrderStatus(req: Request, res: Response) {
    try {
      const { orderId, status } = req.body;
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // 提交提取请求
  async submitWithdrawRequest(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { amount } = req.body;
      const request = await orderService.submitWithdraw(userId, amount);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // 管理员更新提取请求状态
  async updateWithdrawRequestStatus(req: Request, res: Response) {
    try {
      const { requestId, status } = req.body;
      const updatedRequest = await orderService.updateWithdrawStatus(requestId, status);
      res.json(updatedRequest);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
