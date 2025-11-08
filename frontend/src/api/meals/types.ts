import type { Meal } from '../shared/types';

export interface MealsResponse {
  meals: Meal[];
}

export interface MealResponse {
  meal: Meal;
}

export interface UpdateMealRequest {
  name?: string;
  maxEntries?: number;
}
