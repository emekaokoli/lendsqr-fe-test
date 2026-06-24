import { getUsers, getUserById } from './mockData';
import { User, UsersResponse, Stats, UserFilters } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export async function fetchUsers(
  { page = 1, pageSize = 100, filters = {} }: { page?: number; pageSize?: number; filters?: UserFilters } = {}
): Promise<UsersResponse> {
  await delay(600);

  let data = getUsers();

  if (filters.organization) {
    data = data.filter(u => u.organization.toLowerCase().includes(filters.organization!.toLowerCase()));
  }
  if (filters.username) {
    data = data.filter(u => u.username.toLowerCase().includes(filters.username!.toLowerCase()));
  }
  if (filters.email) {
    data = data.filter(u => u.email.toLowerCase().includes(filters.email!.toLowerCase()));
  }
  if (filters.phone) {
    data = data.filter(u => u.phone.includes(filters.phone!));
  }
  if (filters.status) {
    data = data.filter(u => u.status.toLowerCase() === filters.status!.toLowerCase());
  }
  if (filters.date) {
    data = data.filter(u => u.dateJoined.toLowerCase().includes(filters.date!.toLowerCase()));
  }

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = data.slice(start, end);

  return { items, total, page, pageSize, totalPages };
}

export async function fetchUserById(id: string): Promise<User> {
  await delay(400);
  const user = getUserById(id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function fetchStats(): Promise<Stats> {
  await delay(300);
  const users = getUsers();
  return {
    users: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    usersWithLoans: Math.floor(users.length * 0.496),
    usersWithSavings: Math.floor(users.length * 0.408),
  };
}
