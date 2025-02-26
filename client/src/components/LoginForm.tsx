// FILEPATH: d:/ayi/zhangyu-main/client/src/components/LoginForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const StyledForm = styled(Form)`
  max-width: 300px;
  margin: 0 auto;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      // 这里使用您的后端 API 端点
      const response = await axios.post('/api/login', {
        username: values.username,
        password: values.password
      });

      if (response.data.success) {
        message.success('Login successful!');
        // 假设登录成功后，后端返回了用户信息和token
        localStorage.setItem('token', response.data.token);
        navigate('/home'); // 导航到主页或仪表板
      } else {
        message.error(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Login failed. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledForm
      form={form}
      name="login"
      onFinish={onFinish}
    >
      <StyledFormItem
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </StyledFormItem>

      <StyledFormItem
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </StyledFormItem>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
          Log in
        </Button>
      </Form.Item>
    </StyledForm>
  );
};

export default LoginForm;
