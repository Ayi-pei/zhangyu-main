import { Pool } from 'pg';  // 引入 PostgreSQL 的 Pool
import { Sequelize } from 'sequelize';  // 确保导入 Sequelize 类

// 创建数据库连接池
export const pool = new Pool({
  user: 'dbuser',       // 替换为你的数据库用户名
  host: 'localhost',    // 数据库主机
  database: 'your_database',  // 数据库名
  password: 'password', // 数据库密码
  port: 5432,           // 数据库端口
});

// 你可以继续导出 sequelize 连接
export const sequelize = new Sequelize({
  dialect: 'postgres',   // 指定数据库类型为 postgres
  host: 'localhost',     // 数据库主机地址
  username: 'yourUsername', // 数据库用户名
  password: 'yourPassword', // 数据库密码
  database: 'yourDatabase', // 数据库名
});
