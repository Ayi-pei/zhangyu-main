import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/uresApi"; // 导入 API 方法
import { useAuth } from "../context/AuthContext"; // 认证上下文

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // 从 AuthContext 获取 login 方法

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.login(email, password);
      if (response.success && response.user) {
        login(response.user); // 更新认证状态
        navigate("/home"); // 登录成功后跳转首页
      } else {
        setError(response.error || "登录失败，请检查邮箱和密码");
      }
    } catch (err) {
      setError("登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>用户登录</h2>
      <label htmlFor="email">邮箱：</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="请输入邮箱"
      />
      <label htmlFor="password">密码：</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="请输入密码"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "登录中..." : "登录"}
      </button>
    </form>
  );
};

export default LoginForm;
