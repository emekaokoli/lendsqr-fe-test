import { describe, it, expect, beforeAll } from 'vitest';
import { fetchUsers, fetchUserById, fetchStats } from './users';
import { getUsers } from './mockData';

beforeAll(() => {
  getUsers();
});

describe('fetchUsers', () => {
  it('returns paginated results with default params', async () => {
    const result = await fetchUsers();
    expect(result.items).toHaveLength(100);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(100);
    expect(result.total).toBe(500);
    expect(result.totalPages).toBe(5);
  });

  it('returns correct page 2', async () => {
    const result = await fetchUsers({ page: 2, pageSize: 100 });
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(100);
  });

  it('returns correct page with custom page size', async () => {
    const result = await fetchUsers({ page: 1, pageSize: 10 });
    expect(result.items).toHaveLength(10);
    expect(result.totalPages).toBe(50);
  });

  it('returns last partial page', async () => {
    const result = await fetchUsers({ page: 5, pageSize: 100 });
    expect(result.items).toHaveLength(100);
    expect(result.page).toBe(5);
  });

  it('returns empty items for page beyond total', async () => {
    const result = await fetchUsers({ page: 100, pageSize: 100 });
    expect(result.items).toHaveLength(0);
  });

  it('filters by organization', async () => {
    const result = await fetchUsers({ filters: { organization: 'Lendsqr' } });
    result.items.forEach(u => {
      expect(u.organization.toLowerCase()).toContain('lendsqr');
    });
  });

  it('filters by status', async () => {
    const result = await fetchUsers({ filters: { status: 'Active' } });
    result.items.forEach(u => {
      expect(u.status).toBe('Active');
    });
  });

  it('filters by username', async () => {
    const result = await fetchUsers({ filters: { username: 'grace' } });
    result.items.forEach(u => {
      expect(u.username.toLowerCase()).toContain('grace');
    });
  });

  it('filters by email', async () => {
    const result = await fetchUsers({ filters: { email: '@lendsqr.com' } });
    result.items.forEach(u => {
      expect(u.email.toLowerCase()).toContain('@lendsqr.com');
    });
  });

  it('filters by date', async () => {
    const result = await fetchUsers({ filters: { date: 'Jan' } });
    result.items.forEach(u => {
      expect(u.dateJoined.toLowerCase()).toContain('jan');
    });
  });

  it('filters by phone', async () => {
    const result = await fetchUsers({ filters: { phone: '080' } });
    result.items.forEach(u => {
      expect(u.phone).toContain('080');
    });
  });

  it('returns empty result for non-matching filter', async () => {
    const result = await fetchUsers({ filters: { username: 'nonexistent_user_12345' } });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });
});

describe('fetchUserById', () => {
  it('returns user for valid id', async () => {
    const user = await fetchUserById('usr_0001');
    expect(user.id).toBe('usr_0001');
    expect(user.fullName).toBeTruthy();
  });

  it('throws for non-existent id', async () => {
    await expect(fetchUserById('usr_9999')).rejects.toThrow('User not found');
  });

  it('throws for invalid id format', async () => {
    await expect(fetchUserById('')).rejects.toThrow('User not found');
  });
});

describe('fetchStats', () => {
  it('returns stats with correct total users', async () => {
    const stats = await fetchStats();
    expect(stats.users).toBe(500);
  });

  it('returns numeric values for all stats', async () => {
    const stats = await fetchStats();
    expect(typeof stats.activeUsers).toBe('number');
    expect(typeof stats.usersWithLoans).toBe('number');
    expect(typeof stats.usersWithSavings).toBe('number');
  });

  it('activeUsers is less than or equal to total users', async () => {
    const stats = await fetchStats();
    expect(stats.activeUsers).toBeLessThanOrEqual(stats.users);
    expect(stats.activeUsers).toBeGreaterThanOrEqual(0);
  });
});
