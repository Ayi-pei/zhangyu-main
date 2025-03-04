import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/auth';

export const createTestUser = async (prisma: PrismaClient) => {
  const hashedPassword = await hashPassword('123456');
  return await prisma.user.create({
    data: {
      username: 'testuser',
      password: hashedPassword,
      role: 'user',
      balance: 0
    }
  });
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
}; 