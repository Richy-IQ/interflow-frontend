/* ─────────────────────────────────────────────────────────────────
   Token Storage Utility
   – Centralises all access/refresh token reads and writes so the
     rest of the app never touches localStorage keys directly.
   ───────────────────────────────────────────────────────────────── */

const ACCESS_KEY  = 'interflow_access';
const REFRESH_KEY = 'interflow_refresh';

export const tokens = {
  /**
   * Store tokens. Pass null for refresh to keep the existing refresh token
   * (used when only the access token is being rotated after a 401 refresh).
   */
  set(access, refresh) {
    if (access)  localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },

  /** Read the current access token */
  getAccess() {
    return localStorage.getItem(ACCESS_KEY);
  },

  /** Read the current refresh token */
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },

  /** Remove both tokens (called on logout or auth failure) */
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  /** True if an access token exists (does NOT validate expiry) */
  hasAccess() {
    return Boolean(localStorage.getItem(ACCESS_KEY));
  },
};

export default tokens;
