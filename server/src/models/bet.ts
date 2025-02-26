/// FILEPATH: d:/ayi/zhangyu-main/server/src/models/bet.ts

// FILEPATH: d:/ayi/zhangyu-main/server/src/models/bet.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { User } from './User';

// Bet 模型的属性
interface BetAttributes {
  id: number;
  userId: number;
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  gameId?: number;
  result?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建时可选的属性
interface BetCreationAttributes extends Optional<BetAttributes, 'id' | 'status' | 'gameId' | 'result' | 'createdAt' | 'updatedAt'> {}

class Bet extends Model<BetAttributes, BetCreationAttributes> implements BetAttributes {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public odds!: number;
  public status!: 'pending' | 'won' | 'lost' | 'cancelled';
  public gameId?: number;
  public result?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 添加关联
  public readonly user?: User;

  // 计算可能的赢利
  public getPotentialWinnings(): number {
    return this.amount * this.odds;
  }

  // 结算投注
  public async settle(winStatus: boolean): Promise<Bet> {
    this.status = winStatus ? 'won' : 'lost';
    this.result = winStatus ? 'Win' : 'Loss';
    return this.save();
  }

  // 取消投注
  public async cancel(): Promise<Bet> {
    this.status = 'cancelled';
    return this.save();
  }
}

Bet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    odds: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'won', 'lost', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'bets',
  }
);

// 定义关联
Bet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Bet, BetAttributes, BetCreationAttributes };
