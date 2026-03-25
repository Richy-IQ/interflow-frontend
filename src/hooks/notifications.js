/* ─────────────────────────────────────────────────────────────────
   Notifications Hooks
   ───────────────────────────────────────────────────────────────── */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/services/index';

export const NOTIF_KEYS = {
  list:        (params) => ['notifications', 'list', params],
  unreadCount: ['notifications', 'unreadCount'],
};

export const useNotifications = (params) =>
  useQuery({
    queryKey: NOTIF_KEYS.list(params),
    queryFn: async () => (await notificationsAPI.list(params)).data.data,
    refetchInterval: 30 * 1000, // poll every 30 s
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: NOTIF_KEYS.unreadCount,
    queryFn: async () => (await notificationsAPI.unreadCount()).data.data.count,
    refetchInterval: 30 * 1000,
  });

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk) => notificationsAPI.markRead(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk) => notificationsAPI.delete(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};
