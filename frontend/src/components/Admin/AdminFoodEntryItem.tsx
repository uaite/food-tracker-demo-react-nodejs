import { Edit2, Trash2 } from 'lucide-react';
import { formatEntryDateTime, formatCalories } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { useGlobalDialogStore } from '@/stores/useGlobalDialogStore';
import DeleteFoodEntryDialog, {
  type DeleteFoodEntryDialogProps,
} from '@/components/FoodEntries/DeleteFoodEntryDialog';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import type { FoodEntry } from '@/api/shared/types';
import FoodEntryForm, {
  type FoodEntryFormProps,
} from '@/components/FoodEntries/FoodEntryForm';

interface AdminFoodEntryItemProps {
  entry: FoodEntry;
}

export default function AdminFoodEntryItem({ entry }: AdminFoodEntryItemProps) {
  const { openDialog, closeDialog } = useGlobalDialogStore();

  const handleEditClick = () => {
    openDialog<FoodEntryFormProps>({
      title: 'Edit Food Entry',
      size: 'lg',
      content: FoodEntryForm,
      props: {
        mode: 'edit',
        entry,
        onSuccess: () => {
          closeDialog();
        },
        onCancel: () => {
          closeDialog();
        },
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog<DeleteFoodEntryDialogProps>({
      title: 'Delete Food Entry',
      size: 'md',
      content: DeleteFoodEntryDialog,
      props: {
        entry,
        onSuccess: () => {
          closeDialog();
        },
        onCancel: () => {
          closeDialog();
        },
      },
    });
  };

  return (
    <Item variant="outline" className="hover:bg-accent/50">
      <ItemContent>
        <ItemTitle>{entry.foodName}</ItemTitle>
        <ItemDescription>
          {entry.user?.name} • {entry.meal.name} •{' '}
          {formatEntryDateTime(entry.entryDateTime)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-sm font-medium text-muted-foreground mr-2">
          {formatCalories(entry.calories)}
        </span>
        <div className="flex gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleEditClick}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleDeleteClick}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </ItemActions>
    </Item>
  );
}
