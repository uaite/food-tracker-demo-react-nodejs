import { Utensils, Filter } from 'lucide-react';
import { useFoodEntriesFilterStore } from '@/stores/useFoodEntriesFilterStore';

export default function EmptyState() {
  const { filters } = useFoodEntriesFilterStore();

  const hasFilters = filters.fromDate || filters.toDate;

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No food entries found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters or add new food entries for this date
          range.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Utensils className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        No food entries yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Start tracking your meals to see them here.
      </p>
    </div>
  );
}
