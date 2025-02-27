import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Card, message } from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getBets, deleteBet, approveBet } from "../api/uresApi";
import { AdminLayout } from "../components/AdminLayout";
import type { TableProps } from 'antd';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Bet {
  id: string;
  userId: string;
  amount: number;
  status: string;
  created_at: string;
  game_type: string;
}

const AdminBets = ({ userRole }: { userRole: string }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    setLoading(true);
    try {
      const { bets: betData } = await getBets();
      setBets(betData || []);
    } catch (error) {
      message.error('获取投注列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const handleDelete = async (id: string) => {
    if (userRole !== "superadmin") return alert("无权限删除");
    try {
      const { success } = await deleteBet(id);
      if (success) {
        message.success('删除成功');
        fetchBets();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleApprove = async (id: string, status: 'approved' | 'rejected') => {
    if (userRole === "viewer") return alert("无权限审核");
    try {
      const { success } = await approveBet(id, status);
      if (success) {
        message.success('操作成功');
        fetchBets();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: TableProps<Bet>['columns'] = [
    {
      title: '投注ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            onClick={() => handleApprove(record.id, 'approved')}
          >
            通过
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  const filteredBets = bets.filter(bet => 
    bet.id.toLowerCase().includes(searchText.toLowerCase()) ||
    bet.userId.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const chartData = [
    { name: "胜利", value: bets.filter((b) => b.status === "win").length },
    { name: "失败", value: bets.filter((b) => b.status === "lose").length },
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      <div className="p-4 bg-gray-800 rounded-lg mb-6">
        <h2 className="text-xl mb-3">投注记录管理</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="搜索投注ID或用户ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">全部</option>
            <option value="win">胜利</option>
            <option value="lose">失败</option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBets}
          loading={loading}
          rowKey="id"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card>
          <h2 className="text-lg font-bold">总投注金额: {totalAmount} 元</h2>
          <BarChart width={300} height={200} data={bets}>
            <XAxis dataKey="userId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">胜负统计</h2>
          <PieChart width={300} height={200}>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBets;
