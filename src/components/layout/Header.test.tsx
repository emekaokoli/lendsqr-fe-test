import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useAuthStore } from '@/store/authStore';

vi.mock('@/assets/logo.svg?react', () => ({
  default: () => <svg data-testid="logo-svg" />,
}));

beforeEach(() => {
  useAuthStore.setState({ isAuthenticated: false, user: null });
});

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header onMenuToggle={() => {}} />);
    const logo = screen.getByLabelText('Home');
    expect(logo).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByPlaceholderText('Search for anything')).toBeInTheDocument();
  });

  it('renders default user name when no user', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('Adedeji')).toBeInTheDocument();
  });

  it('renders user name from store', () => {
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com', name: 'TestUser' } });
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('renders avatar with first letter of user name', () => {
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com', name: 'Alice' } });
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders avatar with default letter when no user', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders Docs link', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('renders notification bell', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('calls onMenuToggle when hamburger is clicked', () => {
    const onMenuToggle = vi.fn();
    render(<Header onMenuToggle={onMenuToggle} />);
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(onMenuToggle).toHaveBeenCalledOnce();
  });

  it('search button has aria-label', () => {
    render(<Header onMenuToggle={() => {}} />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
});
