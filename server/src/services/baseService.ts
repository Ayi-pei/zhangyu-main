import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // 事务处理
  protected async withTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }

  // 通用分页查询
  protected async paginate<T>(
    model: any,
    {
      page = 1,
      pageSize = 10,
      where = {},
      orderBy = { createdAt: 'desc' },
      include = {}
    }: {
      page?: number;
      pageSize?: number;
      where?: any;
      orderBy?: any;
      include?: any;
    }
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      model.count({ where }),
      model.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include
      })
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  // 通用查询单个记录
  protected async findOne<T>(
    model: any,
    where: any,
    include: any = {}
  ): Promise<T | null> {
    return model.findFirst({
      where,
      include
    });
  }

  // 通用创建记录
  protected async create<T>(
    model: any,
    data: any,
    include: any = {}
  ): Promise<T> {
    return model.create({
      data,
      include
    });
  }

  // 通用更新记录
  protected async update<T>(
    model: any,
    where: any,
    data: any,
    include: any = {}
  ): Promise<T> {
    return model.update({
      where,
      data,
      include
    });
  }

  // 通用删除记录
  protected async delete<T>(
    model: any,
    where: any
  ): Promise<T> {
    return model.delete({
      where
    });
  }
} 