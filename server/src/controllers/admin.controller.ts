import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/auth';
import { IUser, IUserUpdate, IUserExport } from '../types/user';

export class AdminController extends BaseController {
  // 用户管理
  async getUsers(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { page = 1, pageSize = 10, search, status } = req.query;

        const where = {
          ...(search && {
            OR: [
              { username: { contains: String(search) } },
              { email: { contains: String(search) } }
            ]
          }),
          ...(status && { status: String(status) })
        };

        const [total, users] = await Promise.all([
          prisma.user.count({ where }),
          prisma.user.findMany({
            where,
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: users,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取用户列表成功',
      '获取用户列表失败'
    );
  }

  async createUser(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { username, password, email, role = 'user' } = req.body;

        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ username }, { email }] }
        });

        if (existingUser) {
          throw new Error('用户名或邮箱已存在');
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            email,
            role,
            status: 'active'
          }
        });

        return { user };
      },
      '创建用户成功',
      '创建用户失败'
    );
  }

  async updateUser(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.password) {
          updateData.password = await hashPassword(updateData.password);
        }

        const user = await prisma.user.update({
          where: { id },
          data: updateData
        });

        return { user };
      },
      '更新用户成功',
      '更新用户失败'
    );
  }

  async deleteUser(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        return { success: true };
      },
      '删除用户成功',
      '删除用户失败'
    );
  }

  // 投注管理
  async getBettingRecords(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { page = 1, pageSize = 10, type, status, startDate, endDate } = req.query;

        const where = {
          ...(type && { type: String(type) }),
          ...(status && { status: String(status) }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(String(startDate)),
              lte: new Date(String(endDate))
            }
          })
        };

        const [total, bets] = await Promise.all([
          prisma.bet.count({ where }),
          prisma.bet.findMany({
            where,
            include: { user: true },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: bets,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取投注记录成功',
      '获取投注记录失败'
    );
  }

  async updateBettingResult(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const { result, status } = req.body;

        const bet = await prisma.bet.findUnique({
          where: { id },
          include: { user: true }
        });

        if (!bet) {
          throw new Error('投注记录不存在');
        }

        // 更新投注状态和结果
        const updatedBet = await prisma.bet.update({
          where: { id },
          data: { result, status }
        });

        // 如果中奖，更新用户余额
        if (status === 'won') {
          await prisma.user.update({
            where: { id: bet.userId },
            data: {
              balance: {
                increment: bet.amount * 2 // 示例：赔率2倍
              }
            }
          });
        }

        return { bet: updatedBet };
      },
      '更新投注结果成功',
      '更新投注结果失败'
    );
  }

  // 交易管理
  async getTransactions(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { page = 1, pageSize = 10, type, status, startDate, endDate } = req.query;

        const where = {
          ...(type && { type: String(type) }),
          ...(status && { status: String(status) }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(String(startDate)),
              lte: new Date(String(endDate))
            }
          })
        };

        const [total, transactions] = await Promise.all([
          prisma.transaction.count({ where }),
          prisma.transaction.findMany({
            where,
            include: { user: true },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
            orderBy: { createdAt: 'desc' }
          })
        ]);

        return {
          records: transactions,
          total,
          page: Number(page),
          pageSize: Number(pageSize)
        };
      },
      '获取交易记录成功',
      '获取交易记录失败'
    );
  }

  async processTransaction(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { id } = req.params;
        const { status, remark } = req.body;

        const transaction = await prisma.transaction.findUnique({
          where: { id },
          include: { user: true }
        });

        if (!transaction) {
          throw new Error('交易记录不存在');
        }

        // 更新交易状态
        const updatedTransaction = await prisma.transaction.update({
          where: { id },
          data: { status, remark }
        });

        // 如果是充值且审核通过，更新用户余额
        if (transaction.type === 'deposit' && status === 'approved') {
          await prisma.user.update({
            where: { id: transaction.userId },
            data: {
              balance: {
                increment: transaction.amount
              }
            }
          });
        }

        return { transaction: updatedTransaction };
      },
      '处理交易成功',
      '处理交易失败'
    );
  }

  // 高级搜索功能
  async search(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const {
          startDate,
          endDate,
          username,
          lotteryResult,
          userIp,
          userLevel,
          type
        } = req.query;

        let results;
        
        switch (type) {
          case 'users':
            results = await prisma.user.findMany({
              where: {
                ...(username && { username: { contains: String(username) } }),
                ...(userIp && { lastLoginIp: String(userIp) }),
                ...(userLevel && { 
                  level: {
                    level: Number(userLevel)
                  }
                }),
                ...(startDate && endDate && {
                  createdAt: {
                    gte: new Date(String(startDate)),
                    lte: new Date(String(endDate))
                  }
                })
              },
              include: {
                bets: true,
                transactions: true
              }
            });
            break;

          case 'lottery':
            results = await prisma.lotteryResult.findMany({
              where: {
                ...(lotteryResult && { result: { contains: String(lotteryResult) } }),
                ...(startDate && endDate && {
                  drawTime: {
                    gte: new Date(String(startDate)),
                    lte: new Date(String(endDate))
                  }
                })
              },
              orderBy: {
                drawTime: 'desc'
              },
              take: 120, // 30页，每页12条
            });
            break;

          case 'bets':
            results = await prisma.bet.findMany({
              where: {
                ...(username && { 
                  user: { 
                    username: { contains: String(username) } 
                  } 
                }),
                ...(startDate && endDate && {
                  createdAt: {
                    gte: new Date(String(startDate)),
                    lte: new Date(String(endDate))
                  }
                })
              },
              include: {
                user: true
              }
            });
            break;

          default:
            throw new Error('无效的搜索类型');
        }

        return { results };
      },
      '搜索成功',
      '搜索失败'
    );
  }

  // 获取未来开奖结果
  async getFutureLotteryResults(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const results = await prisma.lotteryResult.findMany({
          where: {
            drawTime: {
              gt: new Date()
            }
          },
          orderBy: {
            drawTime: 'asc'
          },
          take: 10
        });

        return { results };
      },
      '获取未来开奖结果成功',
      '获取未来开奖结果失败'
    );
  }

  // 更新用户等级
  async updateUserLevel(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { userId } = req.params;
        const { level } = req.body;

        const user = await prisma.user.update({
          where: { id: userId },
          data: { level }
        });

        return { user };
      },
      '更新用户等级成功',
      '更新用户等级失败'
    );
  }

  // 更新用户信誉分
  async updateCreditScore(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { userId } = req.params;
        const { creditScore } = req.body;

        const user = await prisma.user.update({
          where: { id: userId },
          data: { creditScore: Number(creditScore) }
        });

        return { user };
      },
      '更新用户信誉分成功',
      '更新用户信誉分失败'
    );
  }

  // 获取仪表盘数据
  async getDashboardData(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const [
          totalUsers,
          totalBets,
          totalTransactions,
          recentUsers,
          recentBets
        ] = await Promise.all([
          prisma.user.count(),
          prisma.bet.count(),
          prisma.transaction.count(),
          prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
          }),
          prisma.bet.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
          })
        ]);

        return {
          statistics: {
            totalUsers,
            totalBets,
            totalTransactions
          },
          recentData: {
            users: recentUsers,
            bets: recentBets
          }
        };
      },
      '获取仪表盘数据成功',
      '获取仪表盘数据失败'
    );
  }

  // 批量删除用户
  async batchDeleteUsers(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { userIds } = req.body;

        await prisma.user.deleteMany({
          where: {
            id: { in: userIds }
          }
        });

        return { success: true };
      },
      '批量删除用户成功',
      '批量删除用户失败'
    );
  }

  // 批量更新用户
  async batchUpdateUsers(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const { users } = req.body as { users: IUserUpdate[] };

        const updatePromises = users.map((user: IUserUpdate) => 
          prisma.user.update({
            where: { id: user.id },
            data: {
              ...user,
              updatedAt: new Date()
            }
          })
        );

        const updatedUsers = await Promise.all(updatePromises);
        return { users: updatedUsers };
      },
      '批量更新用户成功',
      '批量更新用户失败'
    );
  }

  // 导出用户数据
  async exportUsers(req: Request, res: Response) {
    return this.handleRequest(
      res,
      async () => {
        const users = await prisma.user.findMany({
          include: {
            bets: true,
            transactions: true
          }
        });

        const exportData: IUserExport[] = users.map((user: IUser & { bets: any[]; transactions: any[] }) => ({
          id: user.id,
          username: user.username,
          role: user.role,
          status: user.status,
          level: user.level,
          creditScore: user.creditScore,
          balance: user.balance,
          totalBets: user.bets.length,
          totalTransactions: user.transactions.length,
          createdAt: user.createdAt
        }));

        return { data: exportData };
      },
      '导出用户数据成功',
      '导出用户数据失败'
    );
  }
} 