// FILEPATH: d:/ayi/zhangyu-main/server/src/controllers/userController.ts

import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';

const userService = new UserService();
const authService = new AuthService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser(username, email, password);
      const token = authService.generateToken(user);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await authService.authenticateUser(email, password);
      if (user) {
        const token = authService.generateToken(user);
        res.json({ user, token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
    // 管理员修改用户信息
    async updatePlayerStats(req: Request, res: Response) {
      try {
        const { userId, creditScore, memberLevel } = req.body;
        const updatedUser = await userService.updateUserStats(userId, creditScore, memberLevel);
        res.json(updatedUser);
      } catch (error) {
        res.status(400).json({ message: (error as Error).message });
      }
    }

    // 获取用户信息
    async getUserInfo(req: Request, res: Response) {
      try {
        const userId = (req as any).user.id;
        const user = await userService.getUserById(userId);
        res.json(user);
      } catch (error) {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
