import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalDialogStore } from '@/stores/useGlobalDialogStore';
import FoodEntryForm, { type FoodEntryFormProps } from './FoodEntryForm';

export default function AddFoodEntryButton() {
  const { openDialog, closeDialog } = useGlobalDialogStore();

  const handleAddClick = () => {
    openDialog<FoodEntryFormProps>({
      content: FoodEntryForm,
      title: 'Add Food Entry',
      size: 'md',
      props: {
        mode: 'create',
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
    <Button
      onClick={handleAddClick}
      className="w-full sm:w-auto cursor-pointer"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Food Entry
    </Button>
  );
}
