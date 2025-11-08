import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useCreateFoodEntry, useUpdateFoodEntry } from '@/api/food-entries';
import { useMeals } from '@/api/meals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DateTimePicker from '@/components/ds/DateTimePicker';
import type {
  CreateFoodEntryRequest,
  UpdateFoodEntryRequest,
} from '@/api/food-entries/types';
import type { FoodEntry } from '@/api/shared/types';
import { getApiErrorMessage } from '@/utils/errorHandling';
import { renderFormErrors } from '@/utils/formErrors';

const foodEntrySchema = z.object({
  foodName: z
    .string()
    .min(1, 'Food name is required')
    .min(2, 'Food name must be at least 2 characters')
    .max(100, 'Food name must be less than 100 characters'),
  calories: z
    .number({ message: 'Calories must be a number' })
    .min(1, 'Calories must be at least 1')
    .max(10000, 'Calories must be less than 10,000'),
  mealId: z.string().min(1, 'Please select a meal'),
  entryDateTime: z.date({ message: 'Please select a valid date' }),
});

type FormMode = 'create' | 'edit';

export interface FoodEntryFormProps {
  mode: FormMode;
  entry?: FoodEntry;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FoodEntryForm({
  mode,
  entry,
  onSuccess,
  onCancel,
}: FoodEntryFormProps) {
  const { data: mealsData, isLoading: mealsLoading } = useMeals();
  const createFoodEntry = useCreateFoodEntry();
  const updateFoodEntry = useUpdateFoodEntry();

  const mutation = mode === 'create' ? createFoodEntry : updateFoodEntry;

  const defaultValues =
    mode === 'edit' && entry
      ? {
          foodName: entry.foodName,
          calories: entry.calories,
          mealId: entry.mealId,
          entryDateTime: new Date(entry.entryDateTime),
        }
      : {
          foodName: '',
          calories: 0,
          mealId: '',
          entryDateTime: new Date(),
        };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: foodEntrySchema,
      onSubmit: foodEntrySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'create') {
          const requestData: CreateFoodEntryRequest = {
            foodName: value.foodName.trim(),
            calories: value.calories,
            mealId: value.mealId,
            entryDateTime: value.entryDateTime.toISOString(),
          };
          await createFoodEntry.mutateAsync(requestData);
        } else {
          if (!entry) {
            return;
          }
          const requestData: UpdateFoodEntryRequest = {
            foodName: value.foodName.trim(),
            calories: value.calories,
            mealId: value.mealId,
            entryDateTime: value.entryDateTime.toISOString(),
          };
          await updateFoodEntry.mutateAsync({
            id: entry.id,
            data: requestData,
          });
        }
        onSuccess?.();
      } catch (error) {
        // Error is handled by the mutation
      }
    },
  });

  const isSubmitting = mutation.isPending;
  const isDisabled = isSubmitting || mealsLoading;

  const submitButtonText = mode === 'create' ? 'Add Entry' : 'Update Entry';
  const loadingText = mode === 'create' ? 'Adding...' : 'Updating...';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="foodName"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Food Name</Label>
            <Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="e.g., Grilled Chicken Breast"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isDisabled}
            />
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Field
        name="calories"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Calories</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              placeholder="e.g., 250"
              min="1"
              value={
                field.state.value === 0 ? '' : field.state.value.toString()
              }
              onChange={(e) => {
                const value = e.target.value;
                field.handleChange(value === '' ? 0 : Number(value));
              }}
              onBlur={field.handleBlur}
              disabled={isDisabled}
            />
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Field
        name="mealId"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Meal</Label>
            {mealsLoading ? (
              <div className="flex items-center justify-center py-2">
                <Spinner className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading meals...
                </span>
              </div>
            ) : (
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-full" id={field.name}>
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  {mealsData?.meals.map((meal) => (
                    <SelectItem key={meal.id} value={meal.id}>
                      {meal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Field
        name="entryDateTime"
        children={(field) => (
          <div className="space-y-2">
            <DateTimePicker
              value={field.state.value}
              onChange={(date) => field.handleChange(date)}
              disabled={isDisabled}
            />
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      {mutation.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <div className="text-sm text-destructive font-medium">
            {getApiErrorMessage(mutation.error)}
          </div>
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!canSubmit || isDisabled}
              className="flex-1"
            >
              {isSubmitting && <Spinner className="h-4 w-4 mr-2" />}
              {isSubmitting ? loadingText : submitButtonText}
            </Button>
          </div>
        )}
      />
    </form>
  );
}

export default FoodEntryForm;
