import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Tag,
  Space,
  DatePicker
} from 'antd';
import { adminAPI } from '../../services/api';
import type { TablePaginationConfig } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BettingRecord {
  id: string;
  userId: string;
  username: string;
  type: string;
  amount: number;
  options: string[];
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  result?: string;
}

export const BettingManagement: React.FC = () => {
  const [records, setRecords] = useState<BettingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BettingRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRecords();
  }, [pagination.current, pagination.pageSize]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBettingRecords({
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
      });
      setRecords(response.data.records);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
    } catch (error) {
      message.error('获取投注记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleSetResult = async (values: { result: string }) => {
    try {
      if (selectedRecord) {
        await adminAPI.updateBetting(selectedRecord.id, {
          result: values.result,
          status: values.result === selectedRecord.options[0] ? 'won' : 'lost',
        });
        message.success('设置结果成功');
        setResultModalVisible(false);
        form.resetFields();
        fetchRecords();
      }
    } catch (error) {
      message.error('设置结果失败');
    }
  };

  const columns = [
    { 
      title: '用户名', 
      dataIndex: 'username', 
      key: 'username',
    },
    { 
      title: '投注类型', 
      dataIndex: 'type', 
      key: 'type',
      filters: [
        { text: '彩票', value: 'lottery' },
        { text: '游戏', value: 'game' },
      ],
    },
    { 
      title: '投注金额', 
      dataIndex: 'amount', 
      key: 'amount',
      sorter: true,
    },
    { 
      title: '投注选项', 
      dataIndex: 'options', 
      key: 'options',
      render: (options: string[]) => options.join(', '),
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'gold', text: '待开奖' },
          won: { color: 'green', text: '已中奖' },
          lost: { color: 'red', text: '未中奖' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { 
      title: '投注时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BettingRecord) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRecord(record);
                setResultModalVisible(true);
              }}
            >
              设置结果
            </Button>
          )}
          <Button onClick={() => message.info(`投注详情: ${JSON.stringify(record)}`)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部类型</Option>
            <Option value="lottery">彩票</Option>
            <Option value="game">游戏</Option>
          </Select>
          <Button type="primary" onClick={fetchRecords}>
            查询
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns}
        dataSource={records}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />

      <Modal
        title="设置开奖结果"
        open={resultModalVisible}
        onOk={form.submit}
        onCancel={() => setResultModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleSetResult}
        >
          <Form.Item
            name="result"
            label="开奖结果"
            rules={[{ required: true, message: '请输入开奖结果' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 