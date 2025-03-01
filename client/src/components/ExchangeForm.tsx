import React, { useState, useCallback } from "react";
import * as api from "../api/uresApi"; // 导入 API 方法

const ExchangeForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0); // 兑换金额
  const [isLoading, setIsLoading] = useState<boolean>(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 成功消息

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认提交行为

    if (amount <= 0) {
      setError("请输入有效的兑换金额");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userId = "当前用户ID"; // 这里需要获取实际的用户 ID
      const res = await api.exchange(userId, amount); // 调用 API 进行兑换

      if (res.success) {
        setSuccessMessage(`兑换成功！已兑换金额: ${amount}`);
      } else {
        setError("兑换失败，请稍后再试");
      }
    } catch (err) {
      setError("兑换失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }, [amount]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>兑换积分</h2>
      <label htmlFor="amount">兑换金额：</label>
      <input
        id="amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min="1"
        step="1"
        required
        placeholder="请输入兑换金额"
      />
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "处理中..." : "提交兑换订单"}
      </button>
    </form>
  );
};

export default ExchangeForm;
