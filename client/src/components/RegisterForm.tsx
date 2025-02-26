import React, { useState } from 'react';
import { Form, InputNumber, Button, message } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const StyledForm = styled(Form)`
  max-width: 300px;
  margin: 0 auto;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

interface RechargeFormValues {
  amount: number;
}

const RechargeForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RechargeFormValues) => {
    setLoading(true);

    try {
      // 这里使用您的后端 API 端点
      const response = await axios.post('/api/recharge', {
        amount: values.amount
      });

      if (response.data.success) {
        message.success('Recharge request submitted successfully.');
        form.resetFields();
      } else {
        message.error(response.data.message || 'Recharge request failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Recharge request failed. Please try again.');
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
      name="recharge"
      onFinish={onFinish}
    >
      <StyledFormItem
        name="amount"
        rules={[
          { required: true, message: 'Please input the recharge amount!' },
          { type: 'number', min: 1, message: 'Amount must be at least 1!' }
        ]}
      >
        <InputNumber
          prefix={<DollarOutlined />}
          placeholder="Recharge Amount"
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </StyledFormItem>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
          Submit Recharge Request
        </Button>
      </Form.Item>
    </StyledForm>
  );
};

export default RechargeForm;
