
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const setupAdminAccount = () => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.some(u => u.username === 'admin01')) {
        users.push({ username: 'admin01', password: 'admins01' });
        localStorage.setItem('users', JSON.stringify(users));
    }
};

function LoginPage() {
    const navigate = useNavigate();
    useEffect(() => { setupAdminAccount(); }, []);

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (formData.username.length < 6 || formData.username.length > 8) {
            newErrors.username = '用户名必须为6-8位字符';
        }
        if (formData.password.length < 6 || formData.password.length > 8) {
            newErrors.password = '密码必须为6-8位字符';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u: User) => u.username === formData.username);

            if (user) {
                if (user.password === formData.password) {
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('currentUser', formData.username);
                    localStorage.setItem('userRole', formData.username === 'admin01' ? 'admin' : 'user');

                    if (formData.username === 'admin01') {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                } else {
                    setErrors({ login: '密码不正确' });
                }
            } else {
                const confirmRegister = window.confirm('用户名不存在，是否立即注册？');
                if (confirmRegister) {
                    users.push({ username: formData.username, password: formData.password });
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('注册成功，请重新登录');
                } else {
                    setErrors({ login: '用户名不存在' });
                }
            }
        }
    };

    return (
        <div>
            <h1>前台登录页面</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="用户名" value={formData.username} onChange={handleChange} />
                <input type="password" name="password" placeholder="密码" value={formData.password} onChange={handleChange} />
                <button type="submit">登录</button>
                {errors.login && <p>{errors.login}</p>}
            </form>
        </div>
    );
}

export default LoginPage;
