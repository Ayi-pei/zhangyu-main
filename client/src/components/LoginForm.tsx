// FILEPATH: d:/ayi/zhangyu-main/client/src/components/LoginForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { login } from '../api/uresApi';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const LoginCard = styled.div`
  max-width: 28rem;
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

const StyledForm = styled(Form)`
  margin-top: 2rem;

  .ant-form-item {
    margin-bottom: 1rem;
  }

  .ant-input-affix-wrapper {
    border-radius: 0.375rem;
  }
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  a {
    font-size: 0.875rem;
    color: #4f46e5;
    text-decoration: none;

    &:hover {
      color: #4338ca;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 2.75rem;
  background-color: #4f46e5;
  border-color: #4f46e5;

  &:hover {
    background-color: #4338ca;
    border-color: #4338ca;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      if (response.success) {
        message.success('登录成功');
        localStorage.setItem('token', response.user.token);
        navigate('/dashboard');
      } else {
        message.error(response.error || '登录失败');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>登录您的账户</Title>
        <StyledForm
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登录
            </StyledButton>
          </Form.Item>
          
          <ActionLinks>
            <a href="/forgot-password">忘记密码？</a>
            <a href="/register">注册新账户</a>
          </ActionLinks>
        </StyledForm>
      </LoginCard>
    </LoginContainer>
  );
};
