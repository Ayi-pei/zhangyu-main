import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestThemeProvider, useTheme } from '@/context/ThemeContext';

const TestComponent = () => {
  const { themeMode, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-mode">Current theme: {themeMode}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides theme context and allows theme toggle', () => {
    render(
      <TestThemeProvider>
        <TestComponent />
      </TestThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    fireEvent.click(screen.getByText(/toggle theme/i));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });
}); 