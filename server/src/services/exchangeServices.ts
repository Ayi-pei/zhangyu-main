// src/services/exchangeServices.ts
import { pool } from '../utils/database';
import { addExchangeRecord } from './pointsServices';

export const deductPoints = async (userId: number, amount: number) => {
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET points = points - $1 WHERE id = $2', [amount, userId]);
  } finally {
    client.release();
  }
};

export const addExchangeRecord = async (userId: number, amount: number, verificationCode: string) => {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO exchange_records (user_id, amount, verification_code) VALUES ($1, $2, $3)',
      [userId, amount, verificationCode]
    );
  } finally {
    client.release();
  }
};

