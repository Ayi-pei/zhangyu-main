import express, { Request, Response } from 'express';  // 引入 express 以及 Request 和 Response 类型
import { createClient } from '@supabase/supabase-js';

const app = express();  // 初始化 Express 应用

// 初始化 Supabase 客户端
const supabase = createClient('https://your-project-url.supabase.co', 'your-public-anon-key');

// 获取用户列表的分页接口
export const getUsers = async (page: number, limit: number) => {
  try {
    const { data, error, count } = await supabase
      .from('users')  // 假设你的表名是 users
      .select('*', { count: 'exact' })  // 获取全部字段，并返回总记录数
      .range((page - 1) * limit, page * limit - 1); // 分页查询，从 offset 开始，限制数量

    if (error) {
      throw error;
    }

    return {
      users: data,
      totalCount: count,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], totalCount: 0 };
  }
};

// 冻结用户
export const freezeUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ status: 'frozen' })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error freezing user:', error);
    return { success: false, error };
  }
};

// 解冻用户
export const unfreezeUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ status: 'active' })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error unfreezing user:', error);
    return { success: false, error };
  }
};

// 获取用户状态
export const getUserStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('status')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data?.status || 'active'; // 返回用户状态，如果没有则默认 'active'
  } catch (error) {
    console.error('Error fetching user status:', error);
    return 'active'; // 默认返回 'active'
  }
};

// 删除用户
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
};

// 后端 Node.js 示例
app.get('/api/qrcode', (req: Request, res: Response) => {  // 显式声明 req 和 res 的类型
  const qrCodeUrl = 'https://example.com/your-qrcode';  // 这里可以是动态生成的二维码 URL
  res.json({ qrCodeUrl });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});