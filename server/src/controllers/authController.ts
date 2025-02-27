import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await this.authService.authenticateUser(email, password);
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.authService.generateToken(user);
    res.json({ user, token });
  }

  async register(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    
    const hashedPassword = await this.authService.hashPassword(password);
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword
    });

    const token = this.authService.generateToken(user);
    res.status(201).json({ user, token });
  }
} 