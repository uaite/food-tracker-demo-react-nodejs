import { z } from 'zod';

export const createFoodEntrySchema = z.object({
  foodName: z.string().min(1).max(100),
  calories: z.number().min(1).max(10000),
  mealId: z.string().cuid(),
  entryDateTime: z.string().datetime(),
});

export const updateFoodEntryParamsSchema = z.object({
  id: z.string().cuid(),
});

export const updateFoodEntrySchema = z.object({
  foodName: z.string().min(1).max(100).optional(),
  calories: z.number().min(1).max(10000).optional(),
  mealId: z.string().cuid().optional(),
  entryDateTime: z.string().datetime().optional(),
});

export const deleteFoodEntryParamsSchema = z.object({
  id: z.string().cuid(),
});

export const adminCreateFoodEntrySchema = z.object({
  userId: z.string().cuid(),
  foodName: z.string().min(1).max(100),
  calories: z.number().min(1).max(10000),
  mealId: z.string().cuid(),
  entryDateTime: z.string().datetime(),
});

export const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  allUsers: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export const adminQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  userId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
