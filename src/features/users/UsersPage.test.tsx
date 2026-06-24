import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UsersPage from './UsersPage';
import * as usersApi from '@/api/users';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useRouterState: () => ({ location: { pathname: '/users' } }),
  Link: ({ children, to, className, onClick }: any) => (
    <a href={to} className={className} onClick={onClick}>{children}</a>
  ),
}));

const mockUsers = Array.from({ length: 15 }, (_, i) => ({
  id: `usr_${String(i + 1).padStart(4, '0')}`,
  organization: 'Lendsqr',
  username: `user${i + 1}`,
  email: `user${i + 1}@test.com`,
  phone: '08012345678',
  dateJoined: 'Jan 1, 2023, 12:00 AM',
  status: i % 4 === 0 ? 'Active' : i % 4 === 1 ? 'Inactive' : i % 4 === 2 ? 'Pending' : 'Blacklisted',
  fullName: `User ${i + 1}`,
  avatar: null,
  accountNumber: '1234567890',
  bvn: '08012345678',
  gender: 'Male',
  maritalStatus: 'Single',
  children: 'None',
  typeOfResidence: 'Own Apartment',
  levelOfEducation: 'B.Sc',
  employmentStatus: 'Employed',
  sectorOfEmployment: 'FinTech',
  durationOfEmployment: '2 years',
  officeEmail: `user${i + 1}@lendsqr.com`,
  monthlyIncome: '₦200,000.00 - ₦300,000.00',
  loanRepayment: '50000',
  twitter: '@user1',
  facebook: 'User 1',
  instagram: '@user1_',
  tier: 1,
  accountBalance: '₦100,000.00',
  bank: '1234567890 Providus Bank',
  guarantors: [],
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UsersPage />
    </QueryClientProvider>
  );
}

describe('UsersPage', () => {
  it('renders the page title', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [], total: 0, page: 1, pageSize: 100, totalPages: 0,
    });
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 0, activeUsers: 0, usersWithLoans: 0, usersWithSavings: 0,
    });
    renderPage();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders stat cards', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 500, activeUsers: 200, usersWithLoans: 150, usersWithSavings: 100,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [], total: 0, page: 1, pageSize: 100, totalPages: 0,
    });
    renderPage();
    expect(await screen.findByText('500')).toBeInTheDocument();
    expect(await screen.findByText('200')).toBeInTheDocument();
    expect(await screen.findByText('150')).toBeInTheDocument();
    expect(await screen.findByText('Users with Savings')).toBeInTheDocument();
  });

  it('renders table rows from fetched data', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 15, activeUsers: 4, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: mockUsers, total: 15, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    expect(await screen.findByText('user1')).toBeInTheDocument();
    expect(await screen.findByText('user15')).toBeInTheDocument();
  });

  it('navigates to user detail on table row click', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 1, activeUsers: 0, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [mockUsers[0]], total: 1, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    const row = await screen.findByText('user1');
    fireEvent.click(row.closest('tr')!);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/users/usr_0001' });
  });

  it('renders 3-dot action buttons in each row', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 1, activeUsers: 0, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [mockUsers[0]], total: 1, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    const dotsBtn = await screen.findByLabelText('Row actions');
    expect(dotsBtn).toBeInTheDocument();
  });

  it('shows action menu when 3-dot button is clicked', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 1, activeUsers: 0, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [mockUsers[0]], total: 1, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    const dotsBtn = await screen.findByLabelText('Row actions');
    fireEvent.click(dotsBtn);
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Blacklist User')).toBeInTheDocument();
    expect(screen.getByText('Activate User')).toBeInTheDocument();
  });

  it('navigates to user detail from action menu', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 1, activeUsers: 0, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [mockUsers[0]], total: 1, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    const dotsBtn = await screen.findByLabelText('Row actions');
    fireEvent.click(dotsBtn);
    fireEvent.click(screen.getByText('View Details'));
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/users/usr_0001' });
  });

  it('shows pagination when data is present', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 15, activeUsers: 4, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: mockUsers, total: 15, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    expect(await screen.findByLabelText('Rows per page')).toBeInTheDocument();
  });

  it('shows empty state when no users match filters', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 500, activeUsers: 200, usersWithLoans: 150, usersWithSavings: 100,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: [], total: 0, page: 1, pageSize: 100, totalPages: 0,
    });
    renderPage();
    expect(await screen.findByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Try resetting your filters.')).toBeInTheDocument();
  });

  it('shows loading skeleton when stats are loading', async () => {
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: mockUsers, total: 15, page: 1, pageSize: 100, totalPages: 1,
    });
    vi.spyOn(usersApi, 'fetchStats').mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(await screen.findByText('Users')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockRejectedValue(new Error('API error'));
    vi.spyOn(usersApi, 'fetchUsers').mockRejectedValue(new Error('API error'));
    renderPage();
    expect(await screen.findByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('API error')).toBeInTheDocument();
  });

  it('has a retry button on error state', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockRejectedValue(new Error('API error'));
    vi.spyOn(usersApi, 'fetchUsers').mockRejectedValue(new Error('API error'));
    renderPage();
    expect(await screen.findByText('Try again')).toBeInTheDocument();
  });

  it('renders status badges for different statuses', async () => {
    vi.spyOn(usersApi, 'fetchStats').mockResolvedValue({
      users: 4, activeUsers: 1, usersWithLoans: 0, usersWithSavings: 0,
    });
    vi.spyOn(usersApi, 'fetchUsers').mockResolvedValue({
      items: mockUsers.slice(0, 4), total: 4, page: 1, pageSize: 100, totalPages: 1,
    });
    renderPage();
    expect(await screen.findByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Blacklisted')).toBeInTheDocument();
  });
});
