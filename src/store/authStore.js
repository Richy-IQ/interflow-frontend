import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/services/index';
import tokens from '@/utils/tokens';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      /** Store tokens in both Zustand and localStorage */
      setTokens: (access, refresh) => {
        tokens.set(access, refresh);
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      /**
       * Login action — used directly by LoginPage (non-React-Query path).
       * Returns { success, role, is_onboarded } so the caller can navigate.
       */
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await authAPI.login(credentials);
          const { access, refresh, role, is_onboarded } = res.data.data;
          tokens.set(access, refresh);
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
          const refresh = tokens.getRefresh();
          if (refresh) await authAPI.logout({ refresh });
        } catch {}
        tokens.clear();
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
