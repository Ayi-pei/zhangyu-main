import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import { withAuth } from '../../../components/auth/withAuth';

const TestComponent = () => <div>Protected Content</div>;

describe('withAuth HOC', () => {
  it('redirects to login when user is not authenticated', async () => {
    const ProtectedComponent = withAuth(TestComponent);
    render(<ProtectedComponent />);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });
  });

  it('allows access to authenticated user', async () => {
    const ProtectedComponent = withAuth(TestComponent);
    render(<ProtectedComponent />, {
      initialAuthState: {
        isAuthenticated: true,
        role: 'user'
      }
    });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects non-admin user from admin-only route', async () => {
    const AdminComponent = withAuth(TestComponent, true);
    render(<AdminComponent />, {
      initialAuthState: {
        isAuthenticated: true,
        role: 'user'
      }
    });

    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  it('allows admin access to admin-only route', async () => {
    const AdminComponent = withAuth(TestComponent, true);
    render(<AdminComponent />, {
      initialAuthState: {
        isAuthenticated: true,
        role: 'admin'
      }
    });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login for admin-only route when not authenticated', async () => {
    const AdminComponent = withAuth(TestComponent, true);
    render(<AdminComponent />);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });
  });
}); 