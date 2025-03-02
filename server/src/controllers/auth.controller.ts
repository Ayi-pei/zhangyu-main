import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import type { LoginCredentials } from '../types/auth.types';
import { TokenService } from '../services/token.service';
import { AppError } from '../middleware/error.middleware';

export class AuthController extends BaseController {
  private authService: AuthService;
  private tokenService: TokenService;

  constructor() {
    super();
    this.authService = new AuthService();
    this.tokenService = new TokenService();
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password }: LoginCredentials = req.body;
      const user = await this.authService.register({ username, password });
      res.status(201).json({ message: '注册成功', user });
    } catch (error) {
      if (error instanceof Error && error.message === '用户名已存在') {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Register error:', error);
        res.status(500).json({ message: '服务器错误' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginCredentials = req.body;
      const user = await this.authService.validateUser(username, password);

      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const token = this.authService.generateToken(user.id, user.role);
      res.json({ token, user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        return this.authService.refreshToken(userId);
      },
      '刷新令牌成功',
      '刷新令牌失败'
    );
  }

  async logout(req: Request, res: Response) {
    res.json({ message: '登出成功' });
  }

  async getCurrentUser(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        return this.authService.getUserById(userId);
      },
      '获取当前用户信息成功',
      '获取当前用户信息失败'
    );
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: '未认证' });
      }

      const user = await this.authService.getUserById(userId);
      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }

      const resetToken = this.tokenService.generatePasswordResetToken(user.id);
      
      // 在实际应用中，这里应该发送重置链接到用户邮箱
      // 为了测试，我们直接返回令牌
      res.json({
        message: '密码重置链接已发送',
        resetToken // 仅用于测试
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      const userId = this.tokenService.verifyPasswordResetToken(token);

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      res.json({ message: '密码重置成功' });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('Reset password error:', error);
      res.status(500).json({ message: '服务器错误' });
    }
  }
} 