import { useFoodEntriesFilterStore } from '@/stores/useFoodEntriesFilterStore';
import { DatePicker } from '@/components/ds/DatePicker';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function Filters() {
  const { filters, setFromDate, setToDate, clearFilters } =
    useFoodEntriesFilterStore();

  const hasActiveFilters = filters.fromDate || filters.toDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          value={filters.fromDate}
          onChange={setFromDate}
          label="From Date"
          placeholder="Select start date"
          id="from-date-filter"
        />

        <DatePicker
          value={filters.toDate}
          onChange={setToDate}
          label="To Date"
          placeholder="Select end date"
          id="to-date-filter"
        />
      </div>
    </div>
  );
}
