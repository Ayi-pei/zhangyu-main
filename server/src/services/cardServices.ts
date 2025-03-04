// src/services/cardServices.ts
import { pool } from './utils/database';

export const saveCardInfo = async (userId: number, cardNumber: string, bank: string, cardHolder: string) => {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO cards (user_id, card_number, bank, card_holder) VALUES ($1, $2, $3, $4)',
      [userId, cardNumber, bank, cardHolder]
    );
  } finally {
    client.release();
  }
};

export const getCardInfo = async (userId: number) => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM cards WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  } finally {
    client.release();
  }
};
