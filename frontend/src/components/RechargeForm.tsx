// FILEPATH: d:/ayi/zhangyu-main/client/src/components/RechargeForm.tsx

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { userAPI } from '../services/api';

interface RechargeFormValues {
  amount: number;
  paymentMethod: string;
}

export const RechargeForm: React.FC = () => {
  const [form] = Form.useForm<RechargeFormValues>();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: RechargeFormValues) => {
    setLoading(true);
    try {
      await userAPI.recharge(values);
      message.success('充值申请已提交');
      form.resetFields();
    } catch (error) {
      message.error('充值失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<RechargeFormValues>
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="max-w-md mx-auto"
    >
      <Form.Item
        label="充值金额"
        name="amount"
        rules={[
          { required: true, message: '请输入充值金额' },
          { type: 'number', min: 1, message: '充值金额必须大于0' }
        ]}
      >
        <Input type="number" placeholder="请输入充值金额" />
      </Form.Item>

      <Form.Item
        label="支付方式"
        name="paymentMethod"
        rules={[{ required: true, message: '请选择支付方式' }]}
      >
        <Input placeholder="请选择支付方式" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          确认充值
        </Button>
      </Form.Item>
    </Form>
  );
};
