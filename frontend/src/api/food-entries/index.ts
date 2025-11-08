import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { apiClient } from '../client';
import type { FoodEntry, PaginatedResponse } from '../shared/types';
import type {
  CreateFoodEntryRequest,
  UpdateFoodEntryRequest,
  FoodEntryResponse,
  FoodEntriesQueryParams,
  DailyTotalsResponse,
} from './types';
import { toast } from 'sonner';
import { adminQueryKeys } from '@/api/admin';

export const foodEntriesQueryKeys = {
  all: ['food-entries'] as const,
  list: (params?: FoodEntriesQueryParams) =>
    ['food-entries', 'list', params] as const,
  dailyTotals: (params?: { from: string; to: string }) =>
    ['food-entries', 'daily-totals', params] as const,
} as const;

export const foodEntriesApi = {
  getAll: async (
    params?: FoodEntriesQueryParams
  ): Promise<PaginatedResponse<FoodEntry>> => {
    const response = await apiClient.get('/api/food-entries', { params });
    return response.data;
  },

  create: async (data: CreateFoodEntryRequest): Promise<FoodEntryResponse> => {
    const response = await apiClient.post('/api/food-entries', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateFoodEntryRequest
  ): Promise<FoodEntryResponse> => {
    const response = await apiClient.put(`/api/food-entries/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/food-entries/${id}`);
    return response.data;
  },

  getDailyTotals: async (params?: {
    from: string;
    to: string;
  }): Promise<DailyTotalsResponse> => {
    const response = await apiClient.get('/api/food-entries/daily-totals', {
      params,
    });
    return response.data;
  },
};

export const useFoodEntries = (params?: FoodEntriesQueryParams) => {
  return useQuery({
    queryKey: foodEntriesQueryKeys.list(params),
    queryFn: () => foodEntriesApi.getAll(params),
  });
};

export const useInfiniteFoodEntries = (
  params?: Omit<FoodEntriesQueryParams, 'page'>
) => {
  return useSuspenseInfiniteQuery({
    queryKey: foodEntriesQueryKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      foodEntriesApi.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage < lastPage.pagination.pages
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

export const useDailyTotals = (params?: { from: string; to: string }) => {
  return useQuery({
    queryKey: foodEntriesQueryKeys.dailyTotals(params),
    queryFn: () => foodEntriesApi.getDailyTotals(params),
  });
};

export const useCreateFoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodEntryRequest) => foodEntriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodEntriesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
    },
  });
};

export const useUpdateFoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFoodEntryRequest }) =>
      foodEntriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodEntriesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      toast.success('Food entry updated successfully');
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to update food entry. Please try again.'
      );
    },
  });
};

export const useDeleteFoodEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foodEntriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodEntriesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      toast.success('Food entry deleted successfully');
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to delete food entry. Please try again.'
      );
    },
  });
};
