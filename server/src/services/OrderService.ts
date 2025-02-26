import { Order } from '../models/order';
import { User } from '../models/User';

export class OrderService {
  async submitRecharge(userId: number, amount: number): Promise<Order> {
    return Order.create({
      userId,
      type: 'recharge',
      amount,
      status: 'pending'
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    await order.save();

    if (status === 'approved' && order.type === 'recharge') {
      const user = await User.findByPk(order.userId);
      if (user) {
        user.points += order.amount;
        await user.save();
      }
    }

    return order;
  }

  async submitWithdraw(userId: number, amount: number): Promise<Order> {
    const user = await User.findByPk(userId);
    if (!user || user.points < amount) {
      throw new Error('Insufficient points');
    }
    return Order.create({
      userId,
      type: 'withdraw',
      amount,
      status: 'pending'
    });
  }

  async updateWithdrawStatus(requestId: number, status: string): Promise<Order> {
    const request = await Order.findByPk(requestId);
    if (!request) {
      throw new Error('Withdraw request not found');
    }
    request.status = status;
    await request.save();

    if (status === 'approved' && request.type === 'withdraw') {
      const user = await User.findByPk(request.userId);
      if (user) {
        user.points -= request.amount;
        await user.save();
      }
    }

    return request;
  }
}
