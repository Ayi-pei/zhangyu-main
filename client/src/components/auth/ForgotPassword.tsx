import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { resetPassword } from '../../api/auth';

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await resetPassword(values.email);
      message.success('重置密码邮件已发送，请查收');
      form.resetFields();
    } catch (error) {
      message.error('发送重置密码邮件失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="max-w-md mx-auto"
    >
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入注册时使用的邮箱" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          发送重置密码邮件
        </Button>
      </Form.Item>
    </Form>
  );
}; 