
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from '../pages/pages/AdminLoginPage';
import DashboardPage from '../pages/pages/DashboardPage';
import UsersPage from '../pages/pages/UsersPage';
import OrdersPage from '../pages/pages/OrdersPage';
import BetsPage from '../pages/pages/BetsPage';

function AdminRouter() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    const isAdmin = isAuthenticated && userRole === 'admin';

    return (
        <Router>
            <Routes>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={isAdmin ? <DashboardPage /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/users" element={isAdmin ? <UsersPage /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/orders" element={isAdmin ? <OrdersPage /> : <Navigate to="/admin/login" />} />
                <Route path="/admin/bets" element={isAdmin ? <BetsPage /> : <Navigate to="/admin/login" />} />
                <Route path="*" element={<Navigate to="/admin/login" />} />
            </Routes>
        </Router>
    );
}

export default AdminRouter;
