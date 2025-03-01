
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

function AdminLoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find(u => u.username === 'admin01' && u.password === formData.password);

        if (admin) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', 'admin01');
            navigate('/admin/dashboard');
        } else {
            setError('管理员账号或密码错误');
        }
    };

    return (
        <div>
            <h1>后台登录页面</h1>
            <form onSubmit={handleSubmit}>
                <input type="password" name="password" placeholder="管理员密码" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <button type="submit">登录</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default AdminLoginPage;
