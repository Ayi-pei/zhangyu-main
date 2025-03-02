import jwt from 'jsonwebtoken';
import { BaseService } from './baseService';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/auth';
import { ServiceError, ServiceResponse, CreateUserDto, UserRole } from '../types';
import { PasswordUtils } from '../utils/password';
import type { User, Prisma } from '@prisma/client';

export class AuthService extends BaseService {
  async register(data: { username: string; password: string }) {
    const existingUser = await this.findOne<User>(this.prisma.user, {
      username: data.username
    });

    if (existingUser) {
      throw new ServiceError('账号已存在', 400);
    }

    const hashedPassword = await hashPassword(data.password);
    
    const user = await this.create<User>(this.prisma.user, {
      username: data.username,
      password: hashedPassword,
      role: 'user',
      balance: 0,
      credits: 0,
      memberLevel: 'normal',
      reputation: 100
    });

    const token = generateToken(user);
    return { user: this.excludePassword(user), token };
  }

  async login(data: { username: string; password: string }) {
    const user = await this.findOne<User>(this.prisma.user, {
      username: data.username
    });

    if (!user) {
      throw new ServiceError('账号不存在', 400);
    }

    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new ServiceError('密码错误', 400);
    }

    const token = generateToken(user);
    return { user: this.excludePassword(user), token };
  }

  async refreshToken(userId: string) {
    const user = await this.findOne<User>(this.prisma.user, { id: userId });
    if (!user) {
      throw new ServiceError('用户不存在', 404);
    }
    return { token: generateToken(user) };
  }

  async logout() {
    return { success: true };
  }

  async getUserById(id: string) {
    const user = await this.findOne<User>(this.prisma.user, { id });
    if (!user) {
      throw new ServiceError('用户不存在', 404);
    }
    return this.excludePassword(user);
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