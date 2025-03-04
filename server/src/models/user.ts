// src/models/user.ts
import { PoolClient } from 'pg';
import { pool } from '../utils/database';  // 假设你有数据库连接工具

export interface User {
  id: number;
  username: string;
  password: string;
  points: number;
}

export const getUserById = async (id: number): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  } finally {
    client.release();
  }
};

export const updateUserPoints = async (id: number, points: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET points = $1 WHERE id = $2', [points, id]);
  } finally {
    client.release();
  }
};
