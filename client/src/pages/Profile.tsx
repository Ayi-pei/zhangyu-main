// FILEPATH: d:/ayi/zhangyu-main/client/src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userAPI } from '../services/api';
import { RootState } from '../store/types';
import { ArrowLeft, MessageCircle, RefreshCw, History, LogOut, Star, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import './Profile.css';
import { useTheme } from '../theme/ThemeContext';

interface UserLevel {
  level: 1 | 2 | 3 | 4;
  title: string;
  color: string;
}

const LEVEL_CONFIG: Record<number, { title: string; color: string; stars: number }> = {
  1: { title: '初级会员', color: '#808080', stars: 1 },
  2: { title: '黄金会员', color: '#FFD700', stars: 1 },
  3: { title: '白金会员', color: '#FFD700', stars: 2 },
  4: { title: '钻石会员', color: '#FFD700', stars: 3 }
};

export const Profile: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    winRate: 0,
    totalWinnings: 0
  });
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();
  const { colors, theme, setTheme } = useTheme();

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('获取用户统计信息失败:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderStars = (level: number) => {
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    return Array(config.stars).fill(0).map((_, i) => (
      <Star 
        key={i}
        fill={config.color}
        stroke={config.color}
        className="w-6 h-6"
      />
    ));
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const menuItems = [
    { icon: <History className="menu-icon" />, label: '이력 참여 횟수', value: userStats.totalGames, action: () => navigate('/game-history') },
    { icon: <RefreshCw className="menu-icon" />, label: '충전 보충', action: () => navigate('/recharge') },
    { icon: <MessageCircle className="menu-icon" />, label: '고객 지원', action: () => setShowSupport(true) },
    { icon: <LogOut className="menu-icon" />, label: '종료 후퇴', action: handleLogout },
  ];

  const themeOptions = [
    { value: 'light', label: '明亮' },
    { value: 'dark', label: '暗黑' },
    { value: 'business', label: '商务' },
    { value: 'soft', label: '柔和' }
  ];

  if (!currentUser) {
    return <Spin className="profile-spinner" />;
  }

  return (
    <div 
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="mb-4">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="theme-select"
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border
          }}
        >
          {themeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <img 
            src={currentUser?.profile.avatar || '/default-avatar.png'} 
            alt="头像"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{currentUser?.username}</h2>
            <div className="flex items-center mt-2">
              {currentUser?.level && renderStars(currentUser.level.level)}
              <span className="ml-2 text-gray-600">
                {LEVEL_CONFIG[currentUser.level.level].title}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold">总游戏次数</h3>
            <p className="text-2xl">{userStats.totalGames}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold">胜率</h3>
            <p className="text-2xl">{userStats.winRate}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold">总收益</h3>
            <p className="text-2xl">{userStats.totalWinnings}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">信誉分</h3>
            </div>
            <p className={`text-3xl font-bold ${getCreditScoreColor(currentUser?.creditScore || 0)}`}>
              {currentUser?.creditScore || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">会员等级</h3>
            </div>
            <div className="flex items-center">
              {currentUser?.level && renderStars(currentUser.level.level)}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-container">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft className="back-icon" />
          뒤로 가기
        </button>

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

      {showSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">客服支持</h3>
            <div className="mb-4">
              <p>客服热线: 400-xxx-xxxx</p>
              <p>在线时间: 9:00-22:00</p>
              <p>邮箱: support@example.com</p>
            </div>
            <button
              onClick={() => setShowSupport(false)}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

