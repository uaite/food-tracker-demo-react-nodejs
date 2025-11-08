import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useGlobalDialogStore } from '@/stores/useGlobalDialogStore';
import { useUpdateMeal } from '@/api/meals';
import type { Meal } from '@/api/shared/types';
import { getApiErrorMessage } from '@/utils/errorHandling';
import { renderFormErrors } from '@/utils/formErrors';

const mealSchema = z.object({
  name: z
    .string()
    .min(1, 'Meal name is required')
    .min(2, 'Meal name must be at least 2 characters')
    .max(50, 'Meal name must be less than 50 characters'),
  maxEntries: z
    .number({ message: 'Max entries must be a number' })
    .min(1, 'Max entries must be at least 1')
    .max(10, 'Max entries must be less than or equal to 10'),
});

interface MealFormProps {
  meal: Meal;
}

export default function MealForm({ meal }: MealFormProps) {
  const { closeDialog } = useGlobalDialogStore();
  const updateMeal = useUpdateMeal();

  const form = useForm({
    defaultValues: {
      name: meal.name,
      maxEntries: meal.maxEntries,
    },
    validators: {
      onChange: mealSchema,
      onSubmit: mealSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMeal.mutateAsync({
          id: meal.id,
          data: {
            name: value.name.trim(),
            maxEntries: value.maxEntries,
          },
        });
        closeDialog();
      } catch (error) {
        // Error is handled by the mutation
      }
    },
  });

  const isSubmitting = updateMeal.isPending;

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
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Meal Name</Label>
            <Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="e.g., Breakfast, Lunch, Dinner"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
            />
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Field
        name="maxEntries"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Maximum Entries Per Day</Label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              min="1"
              max="10"
              value={field.state.value.toString()}
              onChange={(e) => {
                const value = e.target.value;
                field.handleChange(value === '' ? 1 : Number(value));
              }}
              onBlur={field.handleBlur}
              disabled={isSubmitting}
            />
            {field.state.meta.isBlurred &&
              !field.state.meta.isValid &&
              renderFormErrors(field.state.meta.errors)}
          </div>
        )}
      />

      {updateMeal.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <div className="text-sm text-destructive font-medium">
            {getApiErrorMessage(updateMeal.error)}
          </div>
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting && <Spinner className="h-4 w-4 mr-2" />}
              {isSubmitting ? 'Updating...' : 'Update Meal'}
            </Button>
          </div>
        )}
      />
    </form>
  );
}
