import { User } from '@/types';

const PREFIX = 'lendsqr_user_';

export function persistUser(user: User) {
  try {
    localStorage.setItem(`${PREFIX}${user.id}`, JSON.stringify(user));
  } catch (e) {
    console.warn('localStorage write failed', e);
  }
}

export function getPersistedUser(id: string): User | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPersistedUser(id: string) {
  try {
    localStorage.removeItem(`${PREFIX}${id}`);
  } catch {}
}
