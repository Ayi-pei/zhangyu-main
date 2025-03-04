import React, { useState, useEffect } from "react";
import { fetchUsers, toggleUserStatus } from "../api/admin"; // 导入 fetchUsers

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(); // 使用 fetchUsers 来获取用户数据
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };
    loadUsers();
  }, []);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    await toggleUserStatus(userId, isBanned);
    setUsers(users.map((u) => (u.id === userId ? { ...u, is_banned: !isBanned } : u)));
  };

  const filteredUsers = users.filter((user) => user.username.includes(searchQuery));

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl mb-4">用户管理</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 bg-gray-800 text-white"
        placeholder="搜索用户"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">用户ID</th>
            <th className="p-2">昵称</th>
            <th className="p-2">信誉值</th>
            <th className="p-2">会员等级</th>
            <th className="p-2">状态</th>
            <th className="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-t border-gray-700">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.reputation}</td>
              <td className="p-2">{user.membershipLevel}</td>
              <td className={`p-2 ${user.is_banned ? "text-red-500" : "text-green-500"}`}>
                {user.is_banned ? "已封禁" : "正常"}
              </td>
              <td className="p-2">
                <button
                  className={`px-3 py-1 rounded ${user.is_banned ? "bg-green-500" : "bg-red-500"} text-white`}
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
  );
};

export default AdminUsers;
