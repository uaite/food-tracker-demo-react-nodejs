export { authApi, useAuthMe, useAuthVerify } from './auth';
export {
  foodEntriesApi,
  useFoodEntries,
  useInfiniteFoodEntries,
  useDailyTotals,
  useCreateFoodEntry,
  useUpdateFoodEntry,
  useDeleteFoodEntry,
} from './food-entries';
export { mealsApi, useMeals, useUpdateMeal } from './meals';
export { adminApi, useWeeklyComparison, useAverageCalories } from './admin';

export { QueryProvider, queryClient } from './queryClient';
export { apiClient } from './client';

export * from './shared/types';
export * from './auth/types';
export * from './food-entries/types';
export * from './meals/types';
export * from './admin/types';
