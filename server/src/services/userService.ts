import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { CreateUserDto, UpdateUserDto, ServiceResponse, UserRole } from '../types';
import { ServiceError } from '../types';
import { AuthService } from './authService';
import { logger } from '../utils/logger';
import { clearCache } from '../middleware/cache';
import type { UpdateProfileDto } from '../types/dto';

export class UserService extends BaseService {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  async createUser(data: CreateUserDto): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new ServiceError('Email already exists', 400);
      }

      const hashedPassword = await this.authService.hashPassword(data.password);
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

  async updateUser(id: string, data: UpdateUserDto): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      if (data.password) {
        data.password = await this.authService.hashPassword(data.password);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data,
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      await clearCache(`user:${id}`);
      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to update user', 500, error);
    }
  }

  async getUserById(id: string): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to get user', 500, error);
    }
  }

  async getUserByEmail(email: string): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Failed to get user', 500, error);
    }
  }

  async updateUserStats(userId: string, data: {
    credits?: number;
    memberLevel?: string;
    reputation?: number;
  }): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data,
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
      throw new ServiceError('Failed to update user stats', 500, error);
    }
  }

  async updateProfile(userId: string, data: UpdateProfileDto): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            upsert: {
              create: data,
              update: data
            }
          }
        },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      await clearCache(`user:${userId}`);
      return { success: true, data: user };
    } catch (error) {
      logger.error('Update profile error:', error);
      throw new ServiceError('Failed to update profile', 500, error);
    }
  }

  async getUserStats(userId: string): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return { success: true, data: user };
    } catch (error) {
      throw new ServiceError('Failed to get user stats', 500, error);
    }
  }

  async validateLogin(email: string, password: string): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          orders: true,
          bets: true,
          cards: true,
          exchanges: true
        }
      });

      if (!user) {
        throw new ServiceError('Invalid credentials', 401);
      }

      const isValid = await this.authService.comparePassword(password, user.password);
      if (!isValid) {
        throw new ServiceError('Invalid credentials', 401);
      }

      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Login failed', 500, error);
    }
  }
}
