import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, Tag, Modal, Input, message } from 'antd';
import { useTheme } from '../../theme/ThemeContext';
import { adminAPI } from '../../services/api';
import { Check, X, AlertCircle } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  type: 'password' | 'recharge' | 'withdraw' | 'lottery';
  userId: string;
  username: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  data: any;
}

export const ApprovalManagement: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ApprovalRequest | null>(null);
  const [remark, setRemark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const columns = [
    {
      title: '申请类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          password: '修改密码',
          recharge: '充值',
          withdraw: '提现',
          lottery: '开奖结果'
        };
        return typeMap[type as keyof typeof typeMap];
      }
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount?: number) => amount ? `¥${amount}` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'warning', text: '待审批' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ApprovalRequest) => (
        record.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<Check size={16} />}
              onClick={() => handleApprove(record)}
            >
              通过
            </Button>
            <Button
              danger
              icon={<X size={16} />}
              onClick={() => handleReject(record)}
            >
              拒绝
            </Button>
            <Button
              icon={<AlertCircle size={16} />}
              onClick={() => showDetails(record)}
            >
              详情
            </Button>
          </div>
        ) : (
          <Button
            icon={<AlertCircle size={16} />}
            onClick={() => showDetails(record)}
          >
            详情
          </Button>
        )
      )
    }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getApprovalRequests();
      setRequests(response.data);
    } catch (error) {
      message.error('获取审批请求失败');
    }
    setLoading(false);
  };

  const handleApprove = (request: ApprovalRequest) => {
    setCurrentRequest(request);
    setModalVisible(true);
  };

  const handleReject = (request: ApprovalRequest) => {
    setCurrentRequest(request);
    setModalVisible(true);
  };

  const showDetails = (request: ApprovalRequest) => {
    Modal.info({
      title: '申请详情',
      content: (
        <div>
          <p>申请ID: {request.id}</p>
          <p>用户ID: {request.userId}</p>
          <p>申请时间: {new Date(request.createdAt).toLocaleString()}</p>
          <p>申请数据: {JSON.stringify(request.data, null, 2)}</p>
        </div>
      )
    });
  };

  const handleSubmit = async (approved: boolean) => {
    if (!currentRequest) return;

    try {
      await adminAPI.processApproval({
        requestId: currentRequest.id,
        approved,
        remark
      });

      message.success(`审批${approved ? '通过' : '拒绝'}成功`);
      setModalVisible(false);
      setRemark('');
      fetchRequests();
    } catch (error) {
      message.error('操作失败');
    }
  };

  return (
    <div className="approval-management">
      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: 'pending',
            label: '待审批',
            children: (
              <Table
                columns={columns}
                dataSource={requests.filter(r => r.status === 'pending')}
                loading={loading}
                rowKey="id"
              />
            )
          },
          {
            key: 'processed',
            label: '已处理',
            children: (
              <Table
                columns={columns}
                dataSource={requests.filter(r => r.status !== 'pending')}
                loading={loading}
                rowKey="id"
              />
            )
          }
        ]}
      />

      <Modal
        title="审批操作"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => handleSubmit(false)}
          >
            拒绝
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => handleSubmit(true)}
          >
            通过
          </Button>
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入审批备注"
          value={remark}
          onChange={e => setRemark(e.target.value)}
        />
      </Modal>
    </div>
  );
}; 