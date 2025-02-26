// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, RefreshCw, History, LogOut } from 'lucide-react';
import axios from 'axios';
import { message, Spin } from 'antd';
import './Profile.css';

interface UserProfile {
  username: string;
  avatar: string;
  balance: number;
  creditScore: number;
  membershipLevel: string;
  gamesPlayed: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      message.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { icon: <History className="menu-icon" />, label: '이력 참여 횟수', value: profile?.gamesPlayed, action: () => navigate('/game-history') },
    { icon: <RefreshCw className="menu-icon" />, label: '충전 보충', action: () => navigate('/recharge') },
    { icon: <MessageCircle className="menu-icon" />, label: '고객 지원', action: () => navigate('/customer-support') },
    { icon: <LogOut className="menu-icon" />, label: '종료 후퇴', action: handleLogout },
  ];

  if (loading) {
    return <Spin className="profile-spinner" />;
  }

  return (
    <div className="profile-container">
      <button onClick={() => navigate('/')} className="back-btn">
        <ArrowLeft className="back-icon" />
        뒤로 가기
      </button>

      <div className="user-info">
        <img src={profile?.avatar} alt="Avatar" className="user-avatar" />
        <h2>{profile?.username}</h2>
        <div className="stats-container">
          <span className="stat-item">현재 잔액：{profile?.balance}</span>
          <span className="stat-item">신용점수: {profile?.creditScore}</span>
          <span className="stat-item">회원 등급: {profile?.membershipLevel}</span>
        </div>
      </div>

      <div className="menu-container">
        {menuItems.map((item, index) => (
          <button key={index} onClick={item.action} className="menu-item">
            {item.icon}
            <span>{item.label}</span>
            {item.value !== undefined && <span className="menu-value">{item.value}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile;

