import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { message } from 'antd';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    message.error('请先登录');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    message.error('无权访问');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 