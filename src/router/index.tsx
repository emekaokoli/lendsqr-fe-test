import { createRouter, createRoute, createRootRoute, redirect, notFound, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import LoginPage from '@/features/auth/LoginPage';
import UsersPage from '@/features/users/UsersPage';
import UserDetailPage from '@/features/users/UserDetailPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { getUserById } from '@/api/mockData';

// Root
const rootRoute = createRootRoute({ component: Outlet });

// Auth guard helper
function requireAuth() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (!isAuthenticated) throw redirect({ to: '/login' });
}

// Login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) throw redirect({ to: '/users' });
  },
});

// Dashboard layout wrapper
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: DashboardLayout,
  beforeLoad: requireAuth,
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/users' }); },
  component: () => null,
});

// Users list
const usersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/users',
  component: UsersPage,
});

// User detail
const userDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/users/$userId',
  component: UserDetailPage,
  beforeLoad: ({ params }) => {
    const user = getUserById(params.userId);
    if (!user) throw notFound();
  },
  notFoundComponent: () => (
    <div style={{ padding: 24 }}>
      <EmptyState
        title="User not found"
        description="The user you're looking for does not exist or may have been removed."
      />
    </div>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute.addChildren([
    indexRoute,
    usersRoute,
    userDetailRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <ErrorState message={error?.message ?? 'An unexpected error occurred.'} />
  ),
  defaultNotFoundComponent: () => (
    <EmptyState title="Page not found" description="The page you're looking for doesn't exist." />
  ),
});
