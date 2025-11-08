import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  WeeklyComparisonResponse,
  AverageCaloriesResponse,
} from './types';

export const adminQueryKeys = {
  all: ['admin'] as const,
  weeklyComparison: ['admin', 'reports', 'weekly-comparison'] as const,
  averageCalories: ['admin', 'reports', 'average-calories'] as const,
};

export const adminApi = {
  getWeeklyComparison: async (): Promise<WeeklyComparisonResponse> => {
    const response = await apiClient.get(
      '/api/admin/reports/weekly-comparison'
    );
    return response.data;
  },

  getAverageCalories: async (): Promise<AverageCaloriesResponse> => {
    const response = await apiClient.get('/api/admin/reports/average-calories');
    return response.data;
  },
};

export const useWeeklyComparison = () => {
  return useSuspenseQuery({
    queryKey: adminQueryKeys.weeklyComparison,
    queryFn: adminApi.getWeeklyComparison,
  });
};

export const useAverageCalories = () => {
  return useSuspenseQuery({
    queryKey: adminQueryKeys.averageCalories,
    queryFn: adminApi.getAverageCalories,
  });
};
