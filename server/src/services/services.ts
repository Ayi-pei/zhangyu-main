// src/services/services.ts
import { saveCardInfo } from './cardServices';
import { deductPoints, getUserPoints } from './pointsServices';
import { addExchangeRecord, getExchangeHistory } from './exchangeServices';

// 保存银行卡信息
export const bindCard = async (userId: number, cardNumber: string, bank: string, cardHolder: string, exchangeCode: string) => {
  try {
    await saveCardInfo(userId, cardNumber, bank, cardHolder, exchangeCode);
    return { success: true, message: '银行卡绑定成功' };
  } catch (error) {
    throw new Error('绑定失败，请稍后再试');
  }
};

// 扣除积分并记录兑换
export const exchangePoints = async (userId: number, amount: number, verificationCode: string) => {
  const userPoints = await getUserPoints(userId); // 获取用户积分
  if (userPoints < amount) {
    throw new Error('积分不足');
  }

  try {
    await deductPoints(userId, amount); // 扣除积分
    await addExchangeRecord(userId, amount, verificationCode); // 记录兑换
    return { success: true, message: '兑换成功' };
  } catch (error) {
    throw new Error('兑换失败，请稍后再试');
  }
};

// 获取兑换历史
export const getExchangeHistory = async (userId: number) => {
  try {
    const history = await getExchangeHistory(userId);
    return { success: true, history };
  } catch (error) {
    throw new Error('获取历史记录失败');
  }
};
