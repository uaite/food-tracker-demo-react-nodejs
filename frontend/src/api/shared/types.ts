export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  dailyCalorieLimit: number;
  createdAt?: string;
}

export interface Meal {
  id: string;
  name: string;
  maxEntries: number;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  mealId: string;
  entryDateTime: string;
  meal: {
    id: string;
    name: string;
    maxEntries: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  entries: T[];
  pagination: PaginationInfo;
}

export interface ApiError {
  error: string;
  details?: any;
}
