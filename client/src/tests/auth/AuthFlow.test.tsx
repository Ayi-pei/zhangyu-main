import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { withAuth } from '../../test/mocks/auth';

const TestComponent = () => <div>Protected Content</div>;
const ProtectedComponent = withAuth(TestComponent);

describe('Authentication Flow', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
  });

  it('redirects to login when user is not authenticated', () => {
    render(<ProtectedComponent />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to admin dashboard after admin login', async () => {
    render(<ProtectedComponent />, {
      initialPath: '/login'
    });

    // 填写管理员登录表单
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 等待重定向到管理员面板
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  it('redirects to user profile after regular user login', async () => {
    render(<ProtectedComponent />, {
      initialPath: '/login'
    });

    // 填写普通用户登录表单
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'user' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 等待重定向到用户页面
    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid credentials', async () => {
    render(<ProtectedComponent />, {
      initialPath: '/login'
    });

    // 填写错误的登录信息
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wrong' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 等待错误消息显示
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
}); 