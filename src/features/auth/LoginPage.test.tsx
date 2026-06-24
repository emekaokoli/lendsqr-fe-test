import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

const mockLogin = vi.fn();

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) => selector({
    login: mockLogin,
  }),
}));

vi.mock('@/assets/pablo-sign-in.svg?react', () => ({
  default: () => <svg data-testid="login-illustration" />,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and subtitle', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<LoginPage />);
    expect(screen.getByText('LOG IN')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<LoginPage />);
    expect(screen.getByText('FORGOT PASSWORD?')).toBeInTheDocument();
  });

  it('shows password when SHOW is clicked', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByText('SHOW'));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('hides password when HIDE is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('SHOW'));
    fireEvent.click(screen.getByText('HIDE'));
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  it('shows validation error for empty email', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('LOG IN'));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByText('LOG IN'));
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('shows validation error for empty password', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByText('LOG IN'));
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('submits form and navigates on valid input', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('LOG IN'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/users' });
    }, { timeout: 3000 });
  });

  it('shows loading state during submission', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('LOG IN'));

    expect(await screen.findByText('Logging in…')).toBeInTheDocument();
    expect(screen.getByText('Logging in…')).toBeDisabled();
  });

  it('renders the illustration', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-illustration')).toBeInTheDocument();
  });
});
