import { describe, it, expect } from 'vitest';
import { getUsers, getUserById } from './mockData';

describe('mockData', () => {
  it('generates 500 users', () => {
    const users = getUsers();
    expect(users).toHaveLength(500);
  });

  it('each user has all required fields', () => {
    const users = getUsers();
    const user = users[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('organization');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    expect(user).toHaveProperty('dateJoined');
    expect(user).toHaveProperty('status');
    expect(user).toHaveProperty('fullName');
    expect(user).toHaveProperty('accountBalance');
    expect(user).toHaveProperty('bank');
    expect(user).toHaveProperty('tier');
    expect(user).toHaveProperty('guarantors');
  });

  it('returns the same instance on subsequent calls', () => {
    const users1 = getUsers();
    const users2 = getUsers();
    expect(users1).toBe(users2);
  });

  it('every user id is unique', () => {
    const users = getUsers();
    const ids = users.map(u => u.id);
    expect(new Set(ids).size).toBe(500);
  });

  it('id format is usr_XXXX', () => {
    const users = getUsers();
    expect(users[0].id).toMatch(/^usr_\d{4}$/);
    expect(users[499].id).toBe('usr_0500');
  });

  it('status is one of the allowed values', () => {
    const allowed = ['Active', 'Inactive', 'Pending', 'Blacklisted'];
    const users = getUsers();
    users.forEach(u => {
      expect(allowed).toContain(u.status);
    });
  });

  it('has at least one user of each status', () => {
    const users = getUsers();
    const statuses = new Set(users.map(u => u.status));
    expect(statuses.has('Active')).toBe(true);
    expect(statuses.has('Inactive')).toBe(true);
    expect(statuses.has('Pending')).toBe(true);
    expect(statuses.has('Blacklisted')).toBe(true);
  });

  it('getUserById returns correct user', () => {
    const user = getUserById('usr_0001');
    expect(user).not.toBeNull();
    expect(user!.id).toBe('usr_0001');
  });

  it('getUserById returns null for non-existent id', () => {
    const user = getUserById('usr_9999');
    expect(user).toBeNull();
  });

  it('each user has 2 guarantors', () => {
    const users = getUsers();
    users.forEach(u => {
      expect(u.guarantors).toHaveLength(2);
    });
  });

  it('guarantors have required fields', () => {
    const users = getUsers();
    users.forEach(u => {
      u.guarantors.forEach(g => {
        expect(g).toHaveProperty('fullName');
        expect(g).toHaveProperty('phone');
        expect(g).toHaveProperty('email');
        expect(g).toHaveProperty('relationship');
      });
    });
  });
});
