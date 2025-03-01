import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

export const createTestUser = async () => {
  const hashedPassword = await hashPassword('testpass123');
  
  return prisma.user.create({
    data: {
      email: `test${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: hashedPassword,
      profile: {
        create: {}
      },
      gameStats: {
        create: {}
      }
    },
    include: {
      profile: true,
      gameStats: true
    }
  });
};

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}; 