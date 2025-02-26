
import React,{ useState, useEffect } from "react";
import { Table, Button, Input, Select, Card } from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getBets, deleteBet, approveBet } from "../api/uresApi";
import AdminLayout from "./AdminLayout"; // 导入 AdminLayout

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminBets = ({ userRole }: { userRole: string }) => {
  const [bets, setBets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    setLoading(true);
    const data = await getBets();
    setBets(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (userRole !== "superadmin") return alert("无权限删除");
    await deleteBet(id);
    fetchBets();
  };

  const handleApprove = async (id: string) => {
    if (userRole === "viewer") return alert("无权限审核");
    await approveBet(id);
    fetchBets();
  };

  const filteredBets = bets.filter((bet) =>
    bet.username.includes(search) || bet.amount.toString().includes(search)
  );

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const chartData = [
    { name: "胜利", value: bets.filter((b) => b.result === "win").length },
    { name: "失败", value: bets.filter((b) => b.result === "lose").length },
  ];

  return (
    <AdminLayout onSearch={setSearch}>
      <div className="p-4 bg-gray-800 rounded-lg mb-6">
        <h2 className="text-xl mb-3">投注记录管理</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="搜索用户或金额"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">全部</option>
            <option value="win">胜利</option>
            <option value="lose">失败</option>
          </Select>
        </div>

        <Table>
          <thead>
            <tr>
              <th>用户</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredBets.map((bet) => (
              <tr key={bet.id}>
                <td>{bet.username}</td>
                <td>{bet.amount} 元</td>
                <td>{bet.result}</td>
                <td>
                  {userRole !== "viewer" && (
                    <Button onClick={() => handleApprove(bet.id)}>审核</Button>
                  )}
                  {userRole === "superadmin" && (
                    <Button className="ml-2" onClick={() => handleDelete(bet.id)} color="red">
                      删除
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card>
          <h2 className="text-lg font-bold">总投注金额: {totalAmount} 元</h2>
          <BarChart width={300} height={200} data={bets}>
            <XAxis dataKey="username" />
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
