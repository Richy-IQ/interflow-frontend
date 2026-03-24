import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.login(credentials);
          const { access, refresh, role, is_onboarded } = res.data.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            user: { role, is_onboarded },
          });
          return { success: true, role, is_onboarded };
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          const refresh = localStorage.getItem('refresh_token');
          if (refresh) await authAPI.logout({ refresh });
        } catch {}
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const res = await authAPI.getMe();
          set({ user: res.data.data });
        } catch {}
      },
    }),
    {
      name: 'interflow-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
