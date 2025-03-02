import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import { clearCache } from '../middleware/cache';
import { createTestUser, generateToken } from './helpers';
import { prismaMock } from './setup';
import { UserService } from '../services/user.service';

// ... 其余代码保持不变 

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should get user profile', async () => {
    const mockUser = {
      id: '1',
      username: 'test',
      password: 'hashedpassword',
      role: 'user',
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    prismaMock.prisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await userService.getProfile('1');
    expect(result).toEqual(expect.objectContaining({
      id: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
      balance: mockUser.balance
    }));
  });
}); 