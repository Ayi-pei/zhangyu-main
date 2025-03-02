import { PrismaClient } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { config } from '../services/config';

// Prisma 客户端
export const prisma = new PrismaClient();

// Supabase 客户端
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// PostgreSQL 连接池
export const pool = new Pool({
  ...config.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  port: typeof config.database.port === 'string' ? parseInt(config.database.port, 10) : config.database.port
});

// 数据库健康检查
export async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('数据库健康检查失败:', error);
    return false;
  }
}

// 数据库初始化
export async function initDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// 优雅关闭
export async function closeDatabase() {
  await prisma.$disconnect();
  await pool.end();
}

// 通用数据库操作函数
export * from '../database';