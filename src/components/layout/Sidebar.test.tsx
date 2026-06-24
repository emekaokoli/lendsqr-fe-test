import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useRouterState: () => ({ location: { pathname: '/users' } }),
  Link: ({ children, to, className, onClick }: any) => (
    <a href={to} className={className} onClick={onClick}>{children}</a>
  ),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ logout: vi.fn() }),
}));

describe('Sidebar', () => {
  it('renders org switcher', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    expect(screen.getByText('Switch Organization')).toBeInTheDocument();
  });

  it('renders navigation groups', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders group labels', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Businesses')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders version number', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    expect(screen.getByText('v1.2.0')).toBeInTheDocument();
  });

  it('adds open class when isOpen is true', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={() => {}} />);
    const aside = container.firstChild as HTMLElement;
    expect(aside.className).toContain('open');
  });

  it('does not add open class when isOpen is false', () => {
    const { container } = render(<Sidebar isOpen={false} onClose={() => {}} />);
    const aside = container.firstChild as HTMLElement;
    expect(aside.className).not.toContain('open');
  });

  it('calls onClose when a nav item is clicked', () => {
    const onClose = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('highlights active route', () => {
    render(<Sidebar isOpen={false} onClose={() => {}} />);
    const userLink = screen.getByText('Users').closest('a')!;
    expect(userLink.className).toContain('active');
  });
});
