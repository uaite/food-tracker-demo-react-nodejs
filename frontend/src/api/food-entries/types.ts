import type { FoodEntry, PaginatedResponse } from '../shared/types';

export interface CreateFoodEntryRequest {
  foodName: string;
  calories: number;
  mealId: string;
  entryDateTime: string;
  userId?: string; // Optional: for admin to create entries for other users
}

export interface UpdateFoodEntryRequest {
  foodName?: string;
  calories?: number;
  mealId?: string;
  entryDateTime?: string;
}

export interface FoodEntriesQueryParams {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  userId?: string;
  allUsers?: boolean;
}

export interface FoodEntryResponse {
  entry: FoodEntry;
}

export interface FoodEntriesResponse extends PaginatedResponse<FoodEntry> {}

export interface DailyTotalsResponse {
  date?: string;
  currentTotalCalories?: number;
  dailyTotals: Record<string, number>;
  dailyCalorieLimit: number;
}
