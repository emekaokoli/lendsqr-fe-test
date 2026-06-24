import { describe, it, expect, beforeEach } from 'vitest';
import { persistUser, getPersistedUser, clearPersistedUser } from './storage';

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
  bvn: '08012345678',
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
  twitter: '@test',
  facebook: 'Test User',
  instagram: '@test_',
  tier: 1,
  accountBalance: '₦100,000.00',
  bank: '1234567890 Providus Bank',
  guarantors: [],
};

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists a user to localStorage', () => {
    persistUser(mockUser);
    const raw = localStorage.getItem('lendsqr_user_usr_0001');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).username).toBe('testuser');
  });

  it('retrieves a persisted user', () => {
    persistUser(mockUser);
    const user = getPersistedUser('usr_0001');
    expect(user).toEqual(mockUser);
  });

  it('returns null for non-persisted user', () => {
    const user = getPersistedUser('usr_9999');
    expect(user).toBeNull();
  });

  it('clears a persisted user', () => {
    persistUser(mockUser);
    clearPersistedUser('usr_0001');
    expect(localStorage.getItem('lendsqr_user_usr_0001')).toBeNull();
  });

  it('handles localStorage write failure gracefully', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    expect(() => persistUser(mockUser)).not.toThrow();
    setItem.mockRestore();
  });

  it('returns null when localStorage has invalid JSON', () => {
    localStorage.setItem('lendsqr_user_usr_0001', 'not-json');
    const user = getPersistedUser('usr_0001');
    expect(user).toBeNull();
  });
});
