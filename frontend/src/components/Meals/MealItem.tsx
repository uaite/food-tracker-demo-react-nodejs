import { Button } from '@/components/ui/button';
import { useGlobalDialogStore } from '@/stores/useGlobalDialogStore';
import MealForm from '@/components/Meals/MealForm';
import { Edit2 } from 'lucide-react';
import type { Meal } from '@/api/shared/types';

interface MealItemProps {
  meal: Meal;
}

export default function MealItem({ meal }: MealItemProps) {
  const { openDialog } = useGlobalDialogStore();

  const handleEditClick = () => {
    openDialog({
      content: MealForm,
      title: 'Edit Meal',
      size: 'md',
      props: { meal },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{meal.name}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-gray-600">Maximum {meal.maxEntries} entries per day</p>
    </div>
  );
}
