/* ─────────────────────────────────────────────────────────────────
   Artist Hooks  (React Query for artist profile & onboarding)
   ───────────────────────────────────────────────────────────────── */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { artistAPI } from '@/services/index';

/* ─── Query Keys ────────────────────────────────────────────────── */
export const ARTIST_KEYS = {
  profile:     ['artist', 'profile'],
  publicProfile: (id) => ['artist', 'profile', 'public', id],
  media:       ['artist', 'media'],
  experiences: ['artist', 'experiences'],
  shareLink:   ['artist', 'shareLink'],
  publicPortfolio: (token) => ['artist', 'portfolio', 'public', token],
  disciplineOptions: (discipline) => ['artist', 'discipline-options', discipline],
};

/* ─── Profile ───────────────────────────────────────────────────── */
export const useArtistProfile = () =>
  useQuery({
    queryKey: ARTIST_KEYS.profile,
    queryFn: async () => (await artistAPI.getProfile()).data.data,
    staleTime: 5 * 60 * 1000,
  });

export const useArtistPublicProfile = (userId) =>
  useQuery({
    queryKey: ARTIST_KEYS.publicProfile(userId),
    queryFn: async () => (await artistAPI.getPublicProfile(userId)).data.data,
    enabled: Boolean(userId),
  });

export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.uploadAvatar(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.profile }),
    onError: () => toast.error('Failed to upload avatar.'),
  });
};

/* ─── Onboarding Steps ──────────────────────────────────────────── */
export const useArtistStep1 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.step1(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.profile }),
    onError: (e) => toast.error(e?.response?.data?.message || 'Step 1 failed.'),
  });
};

export const useArtistStep2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.step2(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.profile }),
    onError: (e) => toast.error(e?.response?.data?.message || 'Step 2 failed.'),
  });
};

export const useArtistStep3 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.step3(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.profile }),
    onError: (e) => toast.error(e?.response?.data?.message || 'Step 3 failed.'),
  });
};

export const useCompleteArtistOnboarding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => artistAPI.completeOnboarding(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.profile }),
  });
};

/* ─── Media ─────────────────────────────────────────────────────── */
export const useArtistMedia = () =>
  useQuery({
    queryKey: ARTIST_KEYS.media,
    queryFn: async () => (await artistAPI.getMedia()).data.data,
  });

export const useUploadArtistMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.uploadMedia(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.media }),
    onError: () => toast.error('Upload failed.'),
  });
};

export const useDeleteArtistMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk) => artistAPI.deleteMedia(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.media }),
  });
};

/* ─── Experiences ───────────────────────────────────────────────── */
export const useArtistExperiences = () =>
  useQuery({
    queryKey: ARTIST_KEYS.experiences,
    queryFn: async () => (await artistAPI.getExperiences()).data.data,
  });

export const useAddExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => artistAPI.addExperience(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.experiences }),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pk, data }) => artistAPI.updateExperience(pk, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.experiences }),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pk) => artistAPI.deleteExperience(pk),
    onSuccess: () => qc.invalidateQueries({ queryKey: ARTIST_KEYS.experiences }),
  });
};

/* ─── Misc ──────────────────────────────────────────────────────── */
export const useDisciplineOptions = (discipline) =>
  useQuery({
    queryKey: ARTIST_KEYS.disciplineOptions(discipline),
    queryFn: async () => (await artistAPI.getDisciplineOptions(discipline)).data.data,
    enabled: Boolean(discipline),
    staleTime: 60 * 60 * 1000, // 1 hour — rarely changes
  });

export const useArtistShareLink = () =>
  useQuery({
    queryKey: ARTIST_KEYS.shareLink,
    queryFn: async () => (await artistAPI.getShareLink()).data.data,
  });

export const usePublicPortfolio = (token) =>
  useQuery({
    queryKey: ARTIST_KEYS.publicPortfolio(token),
    queryFn: async () => (await artistAPI.getPublicPortfolio(token)).data.data,
    enabled: Boolean(token),
  });
