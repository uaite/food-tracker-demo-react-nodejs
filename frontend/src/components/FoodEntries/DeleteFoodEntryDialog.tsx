import { useDeleteFoodEntry } from '@/api/food-entries';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { FoodEntry } from '@/api/shared/types';
import { getApiErrorMessage } from '@/utils/errorHandling';
import { formatEntryDateTime, formatCalories } from '@/utils/format';

export interface DeleteFoodEntryDialogProps {
  entry: FoodEntry;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DeleteFoodEntryDialog({
  entry,
  onSuccess,
  onCancel,
}: DeleteFoodEntryDialogProps) {
  const deleteFoodEntry = useDeleteFoodEntry();

  const handleDelete = async () => {
    try {
      await deleteFoodEntry.mutateAsync(entry.id);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const isDeleting = deleteFoodEntry.isPending;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this food entry? This action cannot be
          undone.
        </p>

        <div className="rounded-md border bg-muted/50 p-3 space-y-1">
          <div className="font-medium">{entry.foodName}</div>
          <div className="text-sm text-muted-foreground">
            {formatCalories(entry.calories)} • {entry.meal.name} •{' '}
            {formatEntryDateTime(entry.entryDateTime)}
          </div>
          {entry.user && (
            <div className="text-sm text-muted-foreground">
              User: {entry.user.name}
            </div>
          )}
        </div>
      </div>

      {deleteFoodEntry.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <div className="text-sm text-destructive font-medium">
            {getApiErrorMessage(deleteFoodEntry.error)}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1"
        >
          {isDeleting && <Spinner className="h-4 w-4 mr-2" />}
          Delete Entry
        </Button>
      </div>
    </div>
  );
}
