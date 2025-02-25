import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, RefreshCw, History, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SupportDialog from '../components/SupportDialog';
import { useUser } from "../context/UserContext";

function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();

  // 从 localStorage 获取游戏跳跃历史和当前余额（建议后续从后端获取）
  const jumpHistory = JSON.parse(localStorage.getItem('jumpHistory') || '[]');
  const currentBalance = parseInt(localStorage.getItem('playerBalance') || '1000');
  const gamesPlayed = jumpHistory.length;

  // 用户头像和登录账号
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    localStorage.getItem('avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  );
  // 登录账号（昵称）从 user 对象中获取，若不存在则使用 localStorage 中保存的
  const loginAccount = user?.name || localStorage.getItem('loginAccount') || '플레이어:001';
  const [password, setPassword] = useState<string>('');

  const menuItems = [
    { icon: <History className="w-6 h-6" />, label: '이력 참여 횟수', value: gamesPlayed, action: () => navigate('/game-history') },
    { icon: <RefreshCw className="w-6 h-6" />, label: '충전 보충', action: () => setShowRechargeDialog(true) },
    { icon: <MessageCircle className="w-6 h-6" />, label: '고객 지원', action: () => navigate('/customer-support') },
    { icon: <LogOut className="w-6 h-6" />, label: '종료 후퇴', action: () => navigate('/') },
  ];

  const [error, setError] = useState(''); // 错误消息
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [jumpHistoryDialog, setJumpHistoryDialog] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false); // 支持对话框

  const handleRechargeConfirm = () => {
    setShowRechargeDialog(false);
    window.open('https://example.com/recharge', '_blank');
  };

  const handleHistoryClick = () => {
    setJumpHistoryDialog(true);
  };

  // 打开支持对话框
  const handleOpenSupportDialog = () => {
    setIsSupportDialogOpen(true);
  };

  // 处理头像更换
  const handleAvatarChange = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
    localStorage.setItem('avatar', newAvatar);
  };

  // 处理密码更改（确保最多8个字符）
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (newPassword.length <= 8) {
      setPassword(newPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8c52ff] to-[#ff914d] pb-16 relative">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-b-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-4 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="flex items-center gap-4 mt-4">
          <img
            src={selectedAvatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <div>
            <h2 className="text-xl font-bold">{loginAccount}</h2>
            <div className="flex gap-4 mt-2 text-sm">
              <span>현재 잔액：{currentBalance}</span>
              {user ? (
                <>
                  <span>신용점수: {user.creditRating ?? '--'}</span>
                  <span>회원 등급: {user.membershipLevel ?? '--'}</span>
                </>
              ) : (
                <>
                  <span>신용점수: --</span>
                  <span>회원 등급: --</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">기본 아바타 선택</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1607572303-51f5973ffb50?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1604071654067-c582b1b4d1e1?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1604119029705-dc9a6226c5ea?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1603994947895-e3c9fa80d285?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1616583187655-eebefac6c82c?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1573159263907-45c4a5ad8d37?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1586843278500-cb6dbd0c4aab?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1604891159634-6ee022836179?w=200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1603148302158-1d00a12289b3?w=200&auto=format&fit=crop&q=80'
          ].map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={() => handleAvatarChange(avatar)}
            />
          ))}
        </div>
      </div>

      {/* Account Settings (仅显示，不可更改登录账号) */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">계정 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용자 이름 (ID)</label>
            <input
              type="text" aria-label="Game input"
              value={loginAccount}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 (8자 이상)</label>
            <input
              type="password" aria-label="Index input"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-lg border border-gray-300"
              maxLength={8}
            />
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.action && item.action()}
            className="w-full bg-white rounded-lg p-4 flex items-center justify-between shadow-sm transition-all hover:bg-gray-200 transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-gray-800">{item.label}</span>
            </div>
            {item.value !== undefined && (
              <span className="text-gray-600">{item.value}</span>
            )}
          </button>
        ))}
      </div>

      {/* Recharge Dialog */}
      {showRechargeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">충전 보충 안내</h3>
              <button
                onClick={() => setShowRechargeDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">
              충전 보충 관련 안내 메시지입니다. 아래 링크를 클릭하시면 충전 페이지로 이동합니다.
            </p>
            <a
              href="https://example.com/recharge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              충전 페이지 바로가기
            </a>
            <div className="mt-4 text-center">
              <button
                onClick={handleRechargeConfirm}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jump History Dialog */}
      {jumpHistoryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">게임 이력</h3>
              <button
                onClick={() => setJumpHistoryDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {jumpHistory.map((game, index) => (
                <div key={index} className="flex justify-between">
                  <span>{game.date}</span>
                  <span className={game.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                    {game.result === 'win' ? '승리' : '패배'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Profile;
