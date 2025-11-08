import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { AuthVerifyResponse, AuthMeResponse } from './types';

const authQueryKeys = {
  verify: ['auth', 'verify'] as const,
  me: ['auth', 'me'] as const,
};

export const authApi = {
  verify: async (): Promise<AuthVerifyResponse> => {
    const response = await apiClient.post('/auth/verify');
    return response.data;
  },

  getMe: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const useAuthVerify = () => {
  return useQuery({
    queryKey: authQueryKeys.verify,
    queryFn: authApi.verify,
    retry: false,
  });
};

export const useAuthMe = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authApi.getMe,
    retry: false,
  });
};
