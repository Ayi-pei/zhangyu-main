import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUPABASE_URL'; // 替换为你的 Supabase 项目 URL
const supabaseKey = 'SUPABASE_ANON_KEY'; // 替换为你的 anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
