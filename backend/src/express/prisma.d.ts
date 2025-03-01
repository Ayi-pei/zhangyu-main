import type { Prisma } from '@prisma/client';

export namespace PrismaTypes {
  export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
      profile: true;
      orders: true;
      bets: true;
      cards: true;
      exchanges: true;
    }
  }>;

  export type CardWithUser = Prisma.CardGetPayload<{
    include: { user: true }
  }>;

  export type ExchangeWithRelations = Prisma.ExchangeGetPayload<{
    include: {
      user: true;
      card: true;
    }
  }>;

  export type OrderWithUser = Prisma.OrderGetPayload<{
    include: { user: true }
  }>;

  export type BetWithUser = Prisma.BetGetPayload<{
    include: { user: true }
  }>;

  // Prisma 事务类型
  export type TransactionClient = Omit<
    Prisma.TransactionClient,
    '$commit' | '$rollback' | '$disconnect'
  >;
}

export {}; 