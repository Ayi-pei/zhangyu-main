import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserDetails, updateUserDetails } from "../components/AdminUserEdit";

const AdminEditPlayer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ username: "", reputation: 0, membershipLevel: "" });

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserDetails(userId!);
      setFormData({
        username: userData.username,
        reputation: userData.reputation,
        membershipLevel: userData.membershipLevel
      });
      setLoading(false);
    };

    loadUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserDetails(userId!, formData);
    navigate("/admin/users");
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl mb-4">编辑玩家信息</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm">用户名</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reputation" className="block text-sm">信誉值</label>
          <input
            id="reputation"
            type="number"
            name="reputation"
            value={formData.reputation}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="membershipLevel" className="block text-sm">会员等级</label>
          <select
            id="membershipLevel"
            name="membershipLevel"
            value={formData.membershipLevel}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white"
          >
            <option value="普通">普通</option>
            <option value="1星">1星</option>
            <option value="2星">2星</option>
            <option value="3星">3星</option>
            <option value="皇冠">皇冠</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          更新信息
        </button>
      </form>
    </div>
  );
};

export default AdminEditPlayer;