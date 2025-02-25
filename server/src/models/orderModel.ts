// D:\ayi\zhangyu-main\server\src\models\orderModel.ts

import { DataTypes, Model } from 'sequelize'; // 如果你使用 Sequelize ORM，或者根据你使用的数据库库来修改
import { sequelize } from '../utils/database'; // 引入数据库连接

// 定义 Order 类，继承 Model 类
class Order extends Model {
  public id!: number; // 订单 ID
  public userId!: number; // 用户 ID，假设每个订单与用户关联
  public totalAmount!: number; // 订单总金额
  public status!: string; // 订单状态（例如：'pending'、'shipped'、'completed'）
  public createdAt!: Date; // 创建时间
  public updatedAt!: Date; // 更新时间
}

// 初始化 Order 模型，指定表名和字段
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize, // 这里需要传入你的 sequelize 实例
    tableName: 'orders', // 数据库中表的名字
    timestamps: true, // 自动生成 createdAt 和 updatedAt 字段
  }
);

export { Order };
