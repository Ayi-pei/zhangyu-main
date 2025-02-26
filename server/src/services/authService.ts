// FILEPATH: d:/ayi/zhangyu-main/server/src/services/authService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UserService } from './userService';

const userService = new UserService();

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyToken = (token: string): User | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as User;
  } catch (error) {
    return null;
  }
};

export const refreshToken = (user: User): string => {
  return generateToken(user);
};

export class UserService {
  async updateUserStats(userId: number, creditScore: number, memberLevel: string): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.creditScore = creditScore;
    user.memberLevel = memberLevel;
    await user.save();
    return user;
  }

  async getUserById(userId: number): Promise<User | null> {
    return User.findByPk(userId);
  }
}