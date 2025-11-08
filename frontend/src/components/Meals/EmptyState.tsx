import { Utensils } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Utensils className="h-16 w-16 mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">No meals found</h3>
      <p className="text-sm text-center max-w-md">
        There are no meals configured yet. Add your first meal to get started.
      </p>
    </div>
  );
}
