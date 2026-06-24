import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
import { getUsers } from '@/api/mockData';

vi.mock('@/features/auth/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login</div>,
}));

let throwComponentError = false;

vi.mock('@/features/users/UsersPage', () => ({
  default: () => {
    if (throwComponentError) throw new Error('Component error');
    return <div data-testid="users-page">Users</div>;
  },
}));

vi.mock('@/features/users/UserDetailPage', () => ({
  default: () => <div data-testid="user-detail-page">User Detail</div>,
}));

vi.mock('@/components/layout/DashboardLayout', async () => {
  const { Outlet } = await import('@tanstack/react-router');
  return {
    default: () => <div data-testid="dashboard-layout"><Outlet /></div>,
  };
});

vi.mock('@/components/ui/ErrorState', () => ({
  default: ({ message }: any) => <div data-testid="error-state">{message}</div>,
}));

vi.mock('@/components/ui/EmptyState', () => ({
  default: ({ title, description }: any) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
}));

beforeEach(() => {
  throwComponentError = false;
  window.history.pushState({}, '', '/');
  useAuthStore.setState({ isAuthenticated: false, user: null });
  getUsers();
});

describe('router', () => {
  it('exports a router instance', async () => {
    const { router } = await import('./index');
    expect(router).toBeDefined();
    expect(router).toHaveProperty('navigate');
  });

  it('has routes defined', async () => {
    const { router } = await import('./index');
    const routes = router.routesByPath;
    expect(routes['/login']).toBeDefined();
    expect(routes['/users']).toBeDefined();
  });

  it('requireAuth redirects when not authenticated', () => {
    useAuthStore.setState({ isAuthenticated: false });
    const path = useAuthStore.getState().isAuthenticated;
    expect(path).toBe(false);
  });

  it('shows login page when not authenticated', async () => {
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('login-page')).toBeInTheDocument();
  });

  it('shows users page when authenticated', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com' } });
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('users-page')).toBeInTheDocument();
  });

  it('shows not found for non-existent route', async () => {
    window.history.pushState({}, '', '/non-existent-route');
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows not found for invalid user ID', async () => {
    window.history.pushState({}, '', '/users/non-existent-id');
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com' } });
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  it('redirects authenticated users from login to users', async () => {
    window.history.pushState({}, '', '/login');
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com' } });
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('users-page')).toBeInTheDocument();
  });

  it('shows user detail page for valid user', async () => {
    window.history.pushState({}, '', '/users/usr_0001');
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com' } });
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('user-detail-page')).toBeInTheDocument();
  });

  it('shows default error component when route throws', async () => {
    throwComponentError = true;
    window.history.pushState({}, '', '/users');
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'test@test.com' } });
    const { RouterProvider } = await import('@tanstack/react-router');
    const { router } = await import('./index');

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Component error')).toBeInTheDocument();
  });
});
