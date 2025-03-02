import { PrismaClient } from '@prisma/client';
import { prisma } from '../db';

export class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // 事务处理
  protected async withTransaction<T>(
    callback: (prisma: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }

  // 通用分页查询
  protected async paginate<T>(
    model: any,
    params: {
      page?: number;
      pageSize?: number;
      where?: any;
      include?: any;
      orderBy?: any;
    }
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, where, include, orderBy } = params;
    const skip = (page - 1) * pageSize;
    
    const [total, items] = await Promise.all([
      model.count({ where }),
      model.findMany({
        skip,
        take: pageSize,
        where,
        include,
        orderBy
      })
    ]);
    
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      items,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  // 通用查询单个记录
  protected async findOne<T>(
    model: any,
    where: any,
    include?: any
  ): Promise<T | null> {
    return model.findUnique({
      where,
      include
    });
  }

  // 通用创建记录
  protected async create<T>(
    model: any,
    data: any,
    include?: any
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
    include?: any
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

  protected async findMany<T>(
    model: any,
    params: {
      where?: any;
      include?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
    }
  ): Promise<T[]> {
    return model.findMany(params);
  }
} 