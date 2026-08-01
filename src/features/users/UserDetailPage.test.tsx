import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDetailPage from './UserDetailPage';
import * as usersApi from '@/api/users';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ userId: 'usr_0001' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
}));

const mockUser = {
  id: 'usr_0001',
  organization: 'Lendsqr',
  username: 'testuser',
  email: 'test@test.com',
  phone: '08012345678',
  dateJoined: 'Jan 1, 2023',
  status: 'Active' as const,
  fullName: 'Test User',
  avatar: null,
  accountNumber: '1234567890',
  bvn: '12345678901',
  gender: 'Male',
  maritalStatus: 'Single',
  children: 'None',
  typeOfResidence: 'Own Apartment',
  levelOfEducation: 'B.Sc',
  employmentStatus: 'Employed',
  sectorOfEmployment: 'FinTech',
  durationOfEmployment: '2 years',
  officeEmail: 'test@lendsqr.com',
  monthlyIncome: '₦200,000.00',
  loanRepayment: '50000',
  twitter: '@testtwitter',
  facebook: 'testfacebook',
  instagram: '@testinstagram',
  tier: 2,
  accountBalance: '₦100,000.00',
  bank: '0123456789 Providus Bank',
  guarantors: [
    { fullName: 'Jane Doe', phone: '08090000000', email: 'jane@test.com', relationship: 'Sister' },
  ],
};

function renderPage(queryClient?: QueryClient) {
  const qc = queryClient ?? new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <UserDetailPage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UserDetailPage', () => {
  it('renders back button and page title during loading', () => {
    vi.spyOn(usersApi, 'fetchUserById').mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Back to Users')).toBeInTheDocument();
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByText('Blacklist User')).toBeInTheDocument();
    expect(screen.getByText('Activate User')).toBeInTheDocument();
  });

  it('renders loading skeleton during fetch', () => {
    vi.spyOn(usersApi, 'fetchUserById').mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Back to Users')).toBeInTheDocument();
    expect(screen.getByText('User Details')).toBeInTheDocument();
  });

  it('renders user full name and details when fetch succeeds', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('T')).toBeInTheDocument();
    expect(screen.getByText('usr_0001')).toBeInTheDocument();
    expect(screen.getByText('₦100,000.00')).toBeInTheDocument();
    expect(screen.getByText('0123456789 Providus Bank')).toBeInTheDocument();
  });

  it('renders all tab labels', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    const tabs = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];
    for (const tab of tabs) {
      expect(await screen.findByText(tab)).toBeInTheDocument();
    }
  });

  it('renders personal information section', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('BVN')).toBeInTheDocument();
    expect(screen.getByText('12345678901')).toBeInTheDocument();
    expect(screen.getByText('08012345678')).toBeInTheDocument();
  });

  it('renders education and employment section', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('Education and Employment')).toBeInTheDocument();
    expect(screen.getByText('Level of Education')).toBeInTheDocument();
    expect(screen.getByText('B.Sc')).toBeInTheDocument();
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
    expect(screen.getByText('₦200,000.00')).toBeInTheDocument();
  });

  it('renders socials section', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('Socials')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('@testtwitter')).toBeInTheDocument();
    expect(screen.getByText('testfacebook')).toBeInTheDocument();
    expect(screen.getByText('@testinstagram')).toBeInTheDocument();
  });

  it('renders guarantor section', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('Guarantor')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders tier stars', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText("User's Tier")).toBeInTheDocument();
  });

  it('navigates back on back button click', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    qc.setQueryData(['user', 'usr_0001'], mockUser);
    renderPage(qc);

    expect(await screen.findByText('usr_0001')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back to Users'));
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/users' });
  });
});
