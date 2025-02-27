// FILEPATH: d:/ayi/zhangyu-main/server/src/services/authService.ts

import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BaseService } from './baseService';
import type { PrismaTypes } from '../types/prisma';
import { config } from '../config/config';
import { ServiceError, ServiceResponse, CreateUserDto, UserRole } from '../types';

export class AuthService extends BaseService {
  async authenticateUser(email: string, password: string): ServiceResponse<PrismaTypes.UserWithRelations> {
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

      const isValid = await this.comparePassword(password, user.password);
      if (!isValid) {
        throw new ServiceError('Invalid credentials', 401);
      }

      return { success: true, data: user };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Authentication failed', 500, error);
    }
  }

  async createUser(data: CreateUserDto): ServiceResponse<PrismaTypes.UserWithRelations> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new ServiceError('Email already exists', 400);
      }

      const hashedPassword = await this.hashPassword(data.password);
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

  generateToken(user: PrismaTypes.UserWithRelations): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '1d' }
    );
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  refreshToken(user: PrismaTypes.UserWithRelations): string {
    return this.generateToken(user);
  }
}