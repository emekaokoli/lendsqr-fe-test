import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('login sets authenticated state', () => {
    const state = useAuthStore.getState();
    state.login({ email: 'test@test.com', password: 'password' });
    const next = useAuthStore.getState();
    expect(next.isAuthenticated).toBe(true);
    expect(next.user).toEqual({ email: 'test@test.com', name: 'Adedeji' });
  });

  it('logout clears authenticated state', () => {
    const state = useAuthStore.getState();
    state.login({ email: 'test@test.com', password: 'password' });
    state.logout();
    const next = useAuthStore.getState();
    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBeNull();
  });

  it('login accepts any credentials', () => {
    const state = useAuthStore.getState();
    state.login({ email: '', password: '' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
