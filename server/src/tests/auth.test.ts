import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // 创建测试用户
    const password = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        username: 'testuser',
        password,
        role: 'user'
      }
    });
  });

  afterAll(async () => {
    // 清理测试数据
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', '用户名或密码错误');
    });
  });

  describe('GET /auth/profile', () => {
    let authToken: string;

    beforeAll(async () => {
      // 获取认证令牌
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: '123456'
        });
      authToken = res.body.token;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', '无效的认证令牌');
    });
  });

  describe('Input Validation', () => {
    it('should validate username length', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'short', // 5个字符，不够6个
          password: '123456',
          confirmPassword: '123456'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('用户名至少6个字符');
    });

    it('should validate username format', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'user@123', // 包含特殊字符
          password: '123456',
          confirmPassword: '123456'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('用户名只能包含字母、数字和下划线');
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: '12345', // 5个字符，不够6个
          confirmPassword: '12345'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('密码至少6个字符');
    });

    it('should validate password match', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: '123456',
          confirmPassword: '654321'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('两次输入的密码不一致');
    });
  });

  describe('Rate Limiting', () => {
    it('should limit excessive requests', async () => {
      for (let i = 0; i < 101; i++) {
        await request(app)
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: '123456'
          });
      }

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: '123456'
        });

      expect(res.status).toBe(429);
      expect(res.body).toHaveProperty('message', '请求过于频繁，请稍后再试');
    });
  });

  describe('Password Reset Flow', () => {
    let resetToken: string;

    it('should generate reset token for existing user', async () => {
      const res = await request(app)
        .post('/auth/forgot-password')
        .send({
          username: 'testuser'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resetToken');
      resetToken = res.body.resetToken;
    });

    it('should fail for non-existing user', async () => {
      const res = await request(app)
        .post('/auth/forgot-password')
        .send({
          username: 'nonexistent'
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', '用户不存在');
    });

    it('should reset password with valid token', async () => {
      const res = await request(app)
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', '密码重置成功');

      // 验证新密码是否生效
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'newpassword123'
        });

      expect(loginRes.status).toBe(200);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', '无效的重置令牌');
    });
  });

  describe('Admin Authentication', () => {
    it('should login successfully with admin credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'admin01',
          password: 'admin888'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'admin01');
      expect(res.body.user).toHaveProperty('role', 'admin');
    });

    it('should prevent registering admin username', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'admin01',
          password: 'somepassword',
          confirmPassword: 'somepassword'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', '不允许注册此用户名');
    });

    it('should fail login with wrong admin password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'admin01',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', '用户名或密码错误');
    });
  });
}); 