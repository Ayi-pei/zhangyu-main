import React, { useEffect, useState } from "react";
import { fetchUsers, fetchBets, fetchStats, toggleUserStatus } from "../api/admin";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [stats, setStats] = useState<{ big: number; small: number; odd: number; even: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, betsData, statsData] = await Promise.all([fetchUsers(), fetchBets(), fetchStats()]);
        setUsers(usersData);
        setBets(betsData);
        setStats(statsData);
      } catch (error) {
        console.error("加载数据失败", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    await toggleUserStatus(userId, isBanned);
    setUsers(users.map((u) => (u.id === userId ? { ...u, is_banned: !isBanned } : u)));
  };

  const filteredUsers = users.filter((user) => user.username.includes(searchQuery));

  if (loading) return <p className="text-center mt-5">加载中...</p>;

  return (
    <div className="flex">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex-1 p-6 bg-gray-900 text-white">
        {/* 顶部导航 */}
        <TopBar onSearch={setSearchQuery} />

        {/* 用户管理 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl mb-3">用户管理</h2>
          <table className="w-full border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2">用户ID</th>
                <th className="p-2">昵称</th>
                <th className="p-2">状态</th>
                <th className="p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.username}</td>
                  <td className={p-2 ${user.is_banned ? "text-red-500" : "text-green-500"}}>
                    {user.is_banned ? "已封禁" : "正常"}
                  </td>
                  <td className="p-2">
                    <button
                      className={px-3 py-1 rounded ${user.is_banned ? "bg-green-500" : "bg-red-500"} text-white}
                      onClick={() => handleToggleBan(user.id, user.is_banned)}
                    >
                      {user.is_banned ? "解封" : "封禁"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 开奖统计 */}
        {stats && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl mb-3">开奖数据统计</h2>
            <Bar
              data={{
                labels: ["Big", "Small", "Odd", "Even"],
                datasets: [
                  {
                    label: "出现次数",
                    data: [stats.big, stats.small, stats.odd, stats.even],
                    backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#F44336"],
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;