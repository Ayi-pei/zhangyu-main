import { User, UserAttributes } from '../models/User';
import { hashPassword } from './authService';

export class UserService {
  async createUser(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    return User.create({ username, email, password: hashedPassword });
  }

  async getUserById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async updateUser(id: number, data: Partial<UserAttributes>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    await user.update(data);
    return user;
  }
}
