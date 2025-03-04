import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServiceError } from './error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; username: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): { id: string; username: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
  } catch (error) {
    throw new ServiceError('无效的令牌', 401);
  }
} 