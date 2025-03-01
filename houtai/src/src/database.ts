// FILEPATH: d:/ayi/zhangyu-main/server/src/utils/database.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { config } from '../config/config';

dotenv.config();

// 定义环境变量的接口
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// 检查环境变量
const checkEnv = (): Env => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return { SUPABASE_URL: url, SUPABASE_ANON_KEY: key };
};

// 创建 Supabase 客户端
const createSupabaseClient = (): SupabaseClient => {
  const env = checkEnv();
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
};

// 导出 Supabase 客户端实例
export const supabase = createSupabaseClient();

const pool = new Pool({
  ...config.database,
  max: 20, // 连接池最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000 // 连接超时时间
});

// 添加连接错误处理
pool.on('error', (err) => {
  console.error('数据库连接错误:', err);
});

// 添加连接池健康检查
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('数据库健康检查失败:', error);
    return false;
  }
};

// 通用数据库操作函数
export async function fetchOne<T>(
  table: string,
  column: string,
  value: any
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
    .single();

  if (error) {
    console.error(`Error fetching from ${table}:`, error);
    return null;
  }

  return data as T;
}

export async function fetchMany<T>(
  table: string,
  column?: string,
  value?: any
): Promise<T[]> {
  let query = supabase.from(table).select('*');

  if (column && value !== undefined) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching from ${table}:`, error);
    return [];
  }

  return data as T[];
}

export async function insertOne<T>(
  table: string,
  data: Partial<T>
): Promise<T | null> {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .single();

  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    return null;
  }

  return insertedData as T;
}

export async function updateOne<T>(
  table: string,
  column: string,
  value: any,
  data: Partial<T>
): Promise<T | null> {
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .eq(column, value)
    .single();

  if (error) {
    console.error(`Error updating in ${table}:`, error);
    return null;
  }

  return updatedData as T;
}

export async function deleteOne(
  table: string,
  column: string,
  value: any
): Promise<boolean> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq(column, value);

  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    return false;
  }

  return true;
}

export { pool, checkDatabaseConnection };
