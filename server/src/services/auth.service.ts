import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BaseService } from './baseService';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/auth';
import { ServiceError, ServiceResponse, CreateUserDto, UserRole } from '../types';
import { PasswordUtils } from '../utils/password';
import type { User, Prisma } from '@prisma/client';
import { prisma } from '../db';
import type { LoginCredentials } from '../types/auth.types';
import { AppError } from '../middleware/error.middleware';

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
        memberLevel: 'NORMAL',
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
    const options = role === 'admin' ? 
      {} : // 管理员令牌无过期时间
      { expiresIn: '24h' }; // 普通用户24小时过期

    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
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

  async createUser(data: CreateUserDto): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new ServiceError('Email already exists', 400);
      }

      if (!PasswordUtils.validatePasswordStrength(data.password)) {
        throw new ServiceError('Password does not meet security requirements', 400);
      }

      const hashedPassword = await PasswordUtils.hash(data.password);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: UserRole.USER,
          credits: 0,
          reputation: 100,
          memberLevel: 'NORMAL'
        },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to create user', 500, error);
    }
  }

  verifyToken(token: string) {
    return verifyToken(token);
  }

  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 