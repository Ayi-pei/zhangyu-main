import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';

export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET!;

  generateAuthToken(userId: string, role: string) {
    return jwt.sign(
      { userId, role },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  generatePasswordResetToken(userId: string) {
    return jwt.sign(
      { userId, type: 'password_reset' },
      this.PASSWORD_RESET_SECRET,
      { expiresIn: '1h' }
    );
  }

  verifyPasswordResetToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.PASSWORD_RESET_SECRET) as jwt.JwtPayload;
      if (decoded.type !== 'password_reset') {
        throw new AppError('无效的重置令牌', 400);
      }
      return decoded.userId;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('重置令牌已过期', 400);
      }
      throw new AppError('无效的重置令牌', 400);
    }
  }
} 