import type { PrismaTypes } from './prisma';

declare global {
  namespace Express {
    interface Request {
      user: PrismaTypes.UserWithRelations;
    }
  }
}

export {}; 