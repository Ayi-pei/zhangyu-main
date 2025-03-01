import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  async register(req: Request<any, any, RegisterInput>, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { username, password } = req.body;
        return this.authService.register({ username, password });
      },
      '注册成功',
      '注册失败'
    );
  }

  async login(req: Request<any, any, LoginInput>, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { username, password } = req.body;
        return this.authService.login({ username, password });
      },
      '登录成功',
      '登录失败'
    );
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
    return this.handleRequest(
      res,
      async () => {
        return this.authService.logout();
      },
      '退出登录成功',
      '退出登录失败'
    );
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
} 