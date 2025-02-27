import { PrismaClient } from '@prisma/client';
import { prisma } from '../app';

export class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
} 