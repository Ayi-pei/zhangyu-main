import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// 数据库连接池配置
const pool = new Pool({
  user: 'dbuser',
  host: 'localhost',
  database: 'your_database',
  password: 'password',
  port: 5432,
});

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class User {
  public id!: number;
  public username!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastLoginAt!: Date;

  // 查询用户
  static async findByUsername(username: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) return null;
      const user = result.rows[0];
      return user;
    } finally {
      client.release();
    }
  }

  // 创建用户
  static async create(username: string, password: string): Promise<User> {
    const client = await pool.connect();
    try {
      const salt = await bcrypt.genSalt(10); // 加密盐
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // 密码验证
  static async comparePassword(storedPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }
}

export { User };

