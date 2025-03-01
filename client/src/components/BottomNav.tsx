import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gamepad2, User, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 ${className}`}>
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => handleNavigation('/')}
          className={`flex flex-col items-center ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">首页</span>
        </button>
        <button
          onClick={() => handleNavigation('/game')}
          className={`flex flex-col items-center ${isActive('/game') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Gamepad2 className="w-6 h-6" />
          <span className="text-xs mt-1">游戏</span>
        </button>
        <button
          onClick={() => handleNavigation('/history')}
          className={`flex flex-col items-center ${isActive('/history') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-xs mt-1">记录</span>
        </button>
        <button
          onClick={() => handleNavigation('/profile')}
          className={`flex flex-col items-center ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">我的</span>
        </button>
      </div>
    </div>
  );
}

export default BottomNav;
