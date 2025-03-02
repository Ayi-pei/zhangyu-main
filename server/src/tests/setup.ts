import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// 创建一个 mock 的 Prisma 客户端类型
export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

let context: MockContext = createMockContext();

beforeEach(() => {
  context = createMockContext();
  mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>();

jest.mock('../db', () => ({
  prisma: mockDeep<PrismaClient>()
})); 