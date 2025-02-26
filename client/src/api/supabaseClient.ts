import { createClient } from '@supabase/supabase-js';

// 你的 Supabase 项目 URL 和密钥，可以从 Supabase 控制台获取
const SUPABASE_URL = 'SUPABASE_URL'; // 替换为你的 Supabase 项目 URL
const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY'; // 替换为你的 Supabase 匿名密钥

// 创建一个 Supabase 客户端实例
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 获取 Supabase 客户端实例的相关功能
export const fetchRecords = async () => {
  const { data, error } = await supabase
    .from('records') // 假设你的表名是 records
    .select('*');

  if (error) {
    console.error('Error fetching records:', error);
    return [];
  }
  return data;
};

// 可以封装更多的 API 方法
export const addRecord = async (record: { value: string }) => {
  const { data, error } = await supabase
    .from('records')
    .insert([record]);

  if (error) {
    console.error('Error adding record:', error);
    return null;
  }
  return data;
};

export const deleteRecord = async (id: number) => {
  const { data, error } = await supabase
    .from('records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting record:', error);
    return null;
  }
  return data;
};
