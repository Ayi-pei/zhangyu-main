import request from 'supertest';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { clearCache } from '../../middleware/cache';
import { createTestUser, generateToken } from '../helpers';

const prisma = new PrismaClient();

describe('User API Integration Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    testUser = await createTestUser();
    authToken = generateToken(testUser);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await clearCache('*');
    await prisma.$disconnect();
  });

  describe('GET /api/users/me', () => {
    it('should return user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', testUser.id);
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/users/me');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        bio: 'New bio',
        avatar: 'new-avatar.jpg'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.profile).toMatchObject(updateData);
    });
  });
}); 