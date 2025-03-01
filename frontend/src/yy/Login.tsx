// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Login.tsx

import React, { useState } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginFormData) => {
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      navigate('/profile');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    try {
      await register(values.username, values.password);
      message.success('注册成功');
      // 自动登录并跳转到个人中心
      await login(values.username, values.password);
      navigate('/profile');
    } catch (error) {
      message.error('注册失败，请稍后重试');
    }
  };

  const items = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form form={form} onFinish={handleRegister} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '请再次输入密码' }]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        centered
      />
    </div>
  );
};

export default Login;
