import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from './types';
import { fetchUserFromApi } from '../api/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      authenticated: false,
      login: (token) => {
        localStorage.setItem('token', token);
        set({ token, authenticated: true, error: null });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, authenticated: false, error: null });
      },
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const data = await fetchUserFromApi(token);
          set({ user: data, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: error as Error });
        }
      },
      setError: (error) => set({ error }),
    }),
    { name: 'auth-storage' }
  )
);
