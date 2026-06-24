import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (credentials) => {
        set({ isAuthenticated: true, user: { email: credentials.email, name: 'Adedeji' } });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'lendsqr-auth' }
  )
);
