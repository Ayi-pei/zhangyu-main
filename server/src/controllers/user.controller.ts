import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';
import { UpdateProfileInput } from '../schemas/auth.schema';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/auth';

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getProfile(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        return this.userService.getProfile(userId);
      },
      '获取个人信息成功',
      '获取个人信息失败'
    );
  }

  async updateProfile(req: Request<any, any, UpdateProfileInput>, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        return this.userService.updateProfile(userId, req.body);
      },
      '更新个人信息成功',
      '更新个人信息失败'
    );
  }

  async getStats(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        return this.userService.getStats(userId);
      },
      '获取统计信息成功',
      '获取统计信息失败'
    );
  }

  async getGameHistory(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        const { page, pageSize } = req.query;
        return this.userService.getGameHistory(
          userId,
          Number(page) || 1,
          Number(pageSize) || 10
        );
      },
      '获取游戏历史成功',
      '获取游戏历史失败'
    );
  }

  async updateBalance(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error('未授权的访问');
        }
        const { amount, type } = req.body;
        return this.userService.updateBalance(userId, Number(amount), type);
      },
      '更新余额成功',
      '更新余额失败'
    );
  }

  async login(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { username, password } = req.body;
        // ... 登录逻辑
      }
    );
  }

  async register(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { username, password } = req.body;
        // ... 注册逻辑
      }
    );
  }
} 