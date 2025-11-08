import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { MealsResponse, UpdateMealRequest, MealResponse } from './types';
import { toast } from 'sonner';
import { foodEntriesQueryKeys } from '../food-entries';

export const mealsQueryKeys = {
  all: ['meals'] as const,
};

export const mealsApi = {
  getAll: async (): Promise<MealsResponse> => {
    const response = await apiClient.get('/api/meals');
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateMealRequest
  ): Promise<MealResponse> => {
    const response = await apiClient.put(`/api/meals/${id}`, data);
    return response.data;
  },
};

export const useMeals = () => {
  return useQuery({
    queryKey: mealsQueryKeys.all,
    queryFn: mealsApi.getAll,
  });
};

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMealRequest }) =>
      mealsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: foodEntriesQueryKeys.all });
      toast.success('Meal updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update meal. Please try again.');
    },
  });
};
