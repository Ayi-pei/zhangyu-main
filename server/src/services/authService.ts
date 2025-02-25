import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
//中间件 / 初始化 Supabase 客户端
const supabase = createClient('https://your-project-id.supabase.co', 'your-anon-key');

// 认证检查中间件
export const checkAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ success: false, message: '未授权访问' });
  }

  try {
    // 使用 Supabase 验证 token
    const { data, error } = await supabase.auth.getUser(token as string);

    if (error || !data) {
      return res.status(403).json({ success: false, message: '无效的授权令牌' });
    }

    // 确保 data 中有 user 属性，并从中提取 id 和 username
    const user = data.user; // 获取 user 对象
    req.user = { id: user.id, username: user.user_metadata.username };

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: '授权验证失败' });
  }
};
