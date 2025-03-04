import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const withAuth = (
  WrappedComponent: React.ComponentType,
  requireAdmin: boolean = false
) => {
  return function WithAuthComponent(props: any) {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        navigate('/profile');
        return;
      }
    }, [user, isAdmin, navigate]);

    if (!user || (requireAdmin && !isAdmin)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}; 