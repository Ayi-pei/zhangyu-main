import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const hasCheckedLogin = useRef(false); // 避免 useEffect 重复执行

  useEffect(() => {
    console.log('Checking login status...');
    if (hasCheckedLogin.current) return;
    hasCheckedLogin.current = true;

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      console.log('User already logged in, redirecting...');
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const onLoginSuccess = () => {
    localStorage.setItem('username', 'user');
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default LoginPage;
