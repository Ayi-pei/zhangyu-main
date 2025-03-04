// src/types/express/index.d.tsRequest 类型
import { User } from '../models/user';  // 假设你的 User 类型位于 src/models/user.ts

declare global {
  namespace Express {
    interface Request {
      user?: { 
        id: string;
        username: string;
      };
    }
  }
}
