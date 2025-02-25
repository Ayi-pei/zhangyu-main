import React, { useState, useCallback } from "react";
import * as api from "../api/uresApi";

const RechargeForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("请输入有效的充值金额");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // 使用新的 recharge 方法
      const res = await api.recharge("当前用户ID", amount);
      alert(`充值成功！金额: ${amount}`);
    } catch (err) {
      setError("充值失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }, [amount]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>充值积分</h2>
      <label htmlFor="amount">充值金额：</label>
      <input 
        id="amount"
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(Number(e.target.value))}
        min="0"
        step="1"
        required
        placeholder="请输入充值金额"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '处理中...' : '提交充值订单'}
      </button>
    </form>
  );
};

export default RechargeForm;