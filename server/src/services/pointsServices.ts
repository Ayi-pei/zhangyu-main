// src/services/pointsServices.ts
import { getDatabase } from '../utils/database'; // 假设这是一个数据库连接工具

// 获取用户积分
export const getUserPoints = async (userId: number) => {
  const db = getDatabase();
  const result = await db.query('SELECT points FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.points || 0;
};

// 扣除积分
export const deductPoints = async (userId: number, amount: number) => {
  const db = getDatabase();
  const result = await db.query('UPDATE users SET points = points - $1 WHERE id = $2 RETURNING points', [amount, userId]);
  if (!result.rows.length) {
    throw new Error('用户不存在');
  }
  return result.rows[0].points;
};
