// FILEPATH: d:/ayi/zhangyu-main/server/src/api/supabase.ts

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中获取 Supabase URL 和 API key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 检查是否成功获取到 URL 和 key
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
