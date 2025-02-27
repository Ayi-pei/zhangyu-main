// src/api/uresApi.ts
import { supabase } from "./supabaseClient";

// 获取用户列表的分页接口（示例）
export const getUsers = async (page: number, limit: number) => {
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { users: data, totalCount: count };
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
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
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error freezing user:', error.message);
    return { success: false, error: error.message };
  }
};

// 解冻用户
export const unfreezeUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ status: 'active' })
      .eq('id', userId);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error unfreezing user:', error.message);
    return { success: false, error: error.message };
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
    if (error) throw error;
    return data?.status || 'active';
  } catch (error: any) {
    console.error('Error fetching user status:', error.message);
    return 'active';
  }
};

// 删除用户
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    return { success: false, error: error.message };
  }
};

// 充值接口：先查询当前积分，再更新
export const recharge = async (userId: string, amount: number) => {
  try {
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    if (queryError) throw new Error(queryError.message);
    const newPoints = (userData?.points || 0) + amount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('id', userId);
    if (updateError) throw new Error(updateError.message);
    return { success: true };
  } catch (error: any) {
    throw new Error('充值失败: ' + error.message);
  }
};

// 兑换接口：先检查当前积分，再更新
export const exchange = async (userId: string, amount: number) => {
  try {
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    if (queryError) throw new Error(queryError.message);
    if (!userData || userData.points < amount) throw new Error("积分不足");
    const newPoints = userData.points - amount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('id', userId);
    if (updateError) throw new Error(updateError.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 登录接口
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 新增：获取投注结果接口（假设表名为 bets）
export const getResults = async (page: number, limit: number) => {
  try {
    const { data, error, count } = await supabase
      .from('bets')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { results: data, totalCount: count };
  } catch (error: any) {
    console.error("Error fetching results:", error.message);
    return { results: [], totalCount: 0 };
  }
};

export const fetchUserList = async () => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      throw error;
    }
    return { data }; // 假设返回的结构包含 `data`
  } catch (err) {
    throw new Error('无法获取用户列表');
  }
};

// 获取投注列表
export const getBets = async (page: number = 1, limit: number = 10) => {
  try {
    const { data, error, count } = await supabase
      .from('bets')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { bets: data, totalCount: count };
  } catch (error: any) {
    console.error('Error fetching bets:', error.message);
    return { bets: [], totalCount: 0 };
  }
};

// 删除投注
export const deleteBet = async (betId: string) => {
  try {
    const { error } = await supabase
      .from('bets')
      .delete()
      .eq('id', betId);
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting bet:', error.message);
    return { success: false, error: error.message };
  }
};

// 审批投注
export const approveBet = async (betId: string, status: 'approved' | 'rejected') => {
  try {
    const { error } = await supabase
      .from('bets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', betId);
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error approving bet:', error.message);
    return { success: false, error: error.message };
  }
};
