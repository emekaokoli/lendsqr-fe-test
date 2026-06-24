import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDetailPage from './UserDetailPage';
import * as usersApi from '@/api/users';

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ userId: 'usr_0001' }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to, className }: any) => <a href={to} className={className}>{children}</a>,
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UserDetailPage />
    </QueryClientProvider>
  );
}

describe('UserDetailPage', () => {
  it('renders back button and page title', () => {
    vi.spyOn(usersApi, 'fetchUserById').mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Back to Users')).toBeInTheDocument();
    expect(screen.getByText('User Details')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    vi.spyOn(usersApi, 'fetchUserById').mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Blacklist User')).toBeInTheDocument();
    expect(screen.getByText('Activate User')).toBeInTheDocument();
  });
});
