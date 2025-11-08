import { z } from 'zod';

export const updateMealSchema = z.object({
  name: z
    .string()
    .min(1, 'Meal name is required')
    .max(100, 'Meal name is too long')
    .optional(),
  maxEntries: z
    .number()
    .int()
    .min(1, 'Max entries must be at least 1')
    .max(10, 'Max entries cannot exceed 10')
    .optional(),
});

export type UpdateMealInput = z.infer<typeof updateMealSchema>;
