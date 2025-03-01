import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  message,
  Popconfirm,
  Space
} from 'antd';
import { adminAPI } from '../../services/api';
import { IUser } from '../../types';

const { Option } = Select;

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      await adminAPI.createUser(values);
      message.success('创建用户成功');
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('创建用户失败');
    }
  };

  const handleUpdateUser = async (values: any) => {
    try {
      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, values);
        message.success('更新用户成功');
        setModalVisible(false);
        form.resetFields();
        fetchUsers();
      }
    } catch (error) {
      message.error('更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  const handleSendMessage = async (values: { message: string }) => {
    try {
      await adminAPI.sendMessage(selectedUserId, values.message);
      message.success('发送消息成功');
      setMessageModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('发送消息失败');
    }
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '等级', dataIndex: ['level', 'level'], key: 'level' },
    { title: '信誉分', dataIndex: 'creditScore', key: 'creditScore' },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IUser) => (
        <Space>
          <Button 
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
          <Button
            onClick={() => {
              setSelectedUserId(record.id);
              setMessageModalVisible(true);
            }}
          >
            发送消息
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => {
          setEditingUser(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        创建用户
      </Button>

      <Table 
        columns={columns} 
        dataSource={users}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingUser ? "编辑用户" : "创建用户"}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdateUser : handleCreateUser}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 6, max: 8, message: '用户名长度必须在6-8个字符之间' }
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name={['level', 'level']}
            label="等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select>
              <Option value={1}>灰星</Option>
              <Option value={2}>金星1</Option>
              <Option value={3}>金星2</Option>
              <Option value={4}>金星3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="creditScore"
            label="信誉分"
            rules={[{ required: true, message: '请输入信誉分' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="发送消息"
        open={messageModalVisible}
        onOk={form.submit}
        onCancel={() => setMessageModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleSendMessage}
        >
          <Form.Item
            name="message"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 