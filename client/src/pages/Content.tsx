import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Input, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

interface Content {
  id: string;
  type: 'comment' | 'profile' | 'image';
  content: string;
  userId: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

const Content: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewContent, setViewContent] = useState<Content | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  useEffect(() => {
    fetchContents();
  }, [filterStatus]);

  const fetchContents = async () => {
    try {
      const response = await axios.get(`/api/admin/contents?status=${filterStatus}`);
      setContents(response.data);
    } catch (error) {
      message.error('获取内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (content: Content) => {
    setViewContent(content);
    setIsModalVisible(true);
  };

  const handleApprove = async (contentId: string) => {
    try {
      await axios.post(`/api/admin/contents/${contentId}/approve`);
      message.success('内容已通过');
      fetchContents();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReject = async (contentId: string) => {
    Modal.confirm({
      title: '驳回内容',
      content: (
        <div>
          <p>请输入驳回原因：</p>
          <TextArea
            rows={4}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请输入驳回原因"
          />
        </div>
      ),
      onOk: async () => {
        try {
          await axios.post(`/api/admin/contents/${contentId}/reject`, {
            reason: rejectReason
          });
          message.success('内容已驳回');
          setRejectReason('');
          fetchContents();
        } catch (error) {
          message.error('操作失败');
        }
      }
    });
  };

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          comment: { text: '评论', color: 'blue' },
          profile: { text: '个人资料', color: 'green' },
          image: { text: '图片', color: 'purple' }
        };
        return (
          <Tag color={typeMap[type as keyof typeof typeMap].color}>
            {typeMap[type as keyof typeof typeMap].text}
          </Tag>
        );
      }
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { text: '待审核', color: 'warning' },
          approved: { text: '已通过', color: 'success' },
          rejected: { text: '已驳回', color: 'error' }
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap].color}>
            {statusMap[status as keyof typeof statusMap].text}
          </Tag>
        );
      }
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
    },
    {
      title: '审核人',
      dataIndex: 'reviewedBy',
      key: 'reviewedBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Content) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                type="text"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200 }}
        >
          <Option value="pending">待审核</Option>
          <Option value="approved">已通过</Option>
          <Option value="rejected">已驳回</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={contents}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="内容详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {viewContent && (
          <div>
            <p>类型：{viewContent.type}</p>
            <p>用户：{viewContent.username}</p>
            <p>内容：</p>
            <div className="border p-4 rounded bg-gray-50">
              {viewContent.type === 'image' ? (
                <img src={viewContent.content} alt="content" className="max-w-full" />
              ) : (
                <p>{viewContent.content}</p>
              )}
            </div>
            <p>提交时间：{viewContent.createdAt}</p>
            {viewContent.reviewedAt && (
              <>
                <p>审核时间：{viewContent.reviewedAt}</p>
                <p>审核人：{viewContent.reviewedBy}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Content; 