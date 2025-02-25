import { Request, Response } from 'express';
import { getUserById, updateUserPoints, getExchangeHistory } from '../services/userServices';
import { bindCard } from '../services/cardServices';
import { supabase } from '../api/supabase';

// 获取用户信息
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ success: false, message: '未授权请求' });
      return;
    }

    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: '用户未找到' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '获取用户信息失败' });
  }
};

// 更新玩家信誉值和会员等级
export const updatePlayerStats = async (req: Request, res: Response) => {
  const { userId, reputation, membershipLevel } = req.body;

  // 确保 userId 存在
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }

  // 输入验证
  if (typeof reputation !== 'number' || !membershipLevel || typeof membershipLevel !== 'string') {
    return res.status(400).json({ error: '无效的输入数据' });
  }

  try {
    // 更新信誉值和会员等级
    const { error } = await supabase
      .from('users')
      .update({ reputation, membership_level: membershipLevel })
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
};

// 更新用户积分
export const updatePoints = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ success: false, message: '未授权请求' });
    return;
  }

  const { points } = req.body;
  if (isNaN(points) || points <= 0) {
    res.status(400).json({ success: false, message: '无效的积分值' });
    return;
  }

  try {
    const userId = req.user.id;
    const success = await updateUserPoints(userId, points);
    if (!success) {
      res.status(500).json({ success: false, message: '更新用户积分失败' });
      return;
    }

    // 重新获取用户信息
    const updatedUser = await getUserById(userId);

    res.json({ success: true, message: '积分更新成功', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '更新积分失败' });
  }
};

// 获取用户兑换历史
export const getUserExchangeHistory = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ success: false, message: '未授权请求' });
    return;
  }

  try {
    const userId = req.user.id;
    const history = await getExchangeHistory(userId);
    res.json({ success: true, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '获取兑换历史失败' });
  }
};

// 绑定银行卡
export const bindUserCard = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ success: false, message: '未授权请求' });
    return;
  }

  const { cardNumber, bank, cardHolder, exchangeCode } = req.body;
  if (!cardNumber || !bank || !cardHolder || !exchangeCode) {
    res.status(400).json({ success: false, message: '缺少银行卡信息' });
    return;
  }

  try {
    const userId = req.user.id;
    const result = await bindCard(userId, cardNumber, bank, cardHolder, exchangeCode);

    if (result.success) {
      res.json({ success: true, message: '银行卡绑定成功' });
    } else {
      res.status(400).json({ success: false, message: result.message || '银行卡绑定失败' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '绑定银行卡失败' });
  }
};
