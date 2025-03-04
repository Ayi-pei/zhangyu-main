import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BaseService } from './baseService';
import { ServiceError, ServiceResponse, CreateUserDto, UserRole } from '../types';
import { prisma } from '../db';
import type { LoginCredentials } from '../types/auth.types';
import { AppError } from '../middleware/error.middleware';
import type { User } from '@prisma/client';

export class AuthService extends BaseService {
  async register(data: LoginCredentials) {
    // 禁止注册管理员账号
    if (data.username === 'admin01') {
      throw new AppError('不允许注册此用户名', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (existingUser) {
      throw new AppError('用户名已存在', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: 'user', // 普通用户只能注册为普通角色
        balance: 0,
        credits: 0,
        member_level: 'NORMAL',
        reputation: 100
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  generateToken(userId: string, role: string) {
    // 管理员账号生成永久令牌，普通用户24小时过期
    const options: jwt.SignOptions = role === 'admin' ? 
      {} : // 管理员令牌无过期时间
      { expiresIn: '24h' }; // 普通用户24小时过期

    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'fallback-secret',
      options
    );
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(data: CreateUserDto): Promise<ServiceResponse> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { 
          username: data.username 
        }
      });

      if (existingUser) {
        return { 
          success: false, 
          message: '用户名已存在' 
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: UserRole.USER,
          balance: 0,
          credits: 0,
          member_level: 'NORMAL',
          reputation: 100
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      
      return { 
        success: true, 
        data: userWithoutPassword,
        message: '用户创建成功'
      };
    } catch (error) {
      return { 
        success: false, 
        message: '创建用户失败',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      throw new AppError('无效的令牌', 401);
    }
  }

  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshToken(userId: string) {
    const user = await this.getUserById(userId);
    const token = this.generateToken(user.id, user.role);
    return { token, user };
  }
} 