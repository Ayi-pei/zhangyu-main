// FILEPATH: d:/ayi/zhangyu-main/client/src/components/AdminUserEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, message, Spin } from 'antd';

const { Option } = Select;

interface UserData {
  id: string;
  username: string;
  email: string;
  creditScore: number;
  memberLevel: string;
}

const AdminUserEdit: React.FC = () => {
  const [form] = Form.useForm();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/users/${userId}`);
        const userData: UserData = response.data;
        form.setFieldsValue(userData);
      } catch (error) {
        message.error('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, form]);

  const onFinish = async (values: UserData) => {
    setLoading(true);
    try {
      await axios.put(`/api/admin/users/${userId}`, values);
      message.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      message.error('Failed to update user');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <h1>Edit User</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="creditScore"
          label="Credit Score"
          rules={[
            { required: true, message: 'Please input the credit score!' },
            { type: 'number', min: 0, max: 1000, message: 'Credit score must be between 0 and 1000!' }
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="memberLevel"
          label="Member Level"
          rules={[{ required: true, message: 'Please select the member level!' }]}
        >
          <Select>
            <Option value="bronze">Bronze</Option>
            <Option value="silver">Silver</Option>
            <Option value="gold">Gold</Option>
            <Option value="platinum">Platinum</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update User
          </Button>
          <Button onClick={() => navigate('/admin/users')} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default AdminUserEdit;
