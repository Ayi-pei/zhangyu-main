import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <div>Logged in as {user.username}</div>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test', 'password')}>Login</button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication context', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/logged in as/i)).toBeInTheDocument();
    });
  });
}); 