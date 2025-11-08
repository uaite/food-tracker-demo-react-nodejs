import { useEffect } from 'react';
import { useInfiniteFoodEntries } from '@/api/food-entries';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useFoodEntriesFilterStore } from '@/stores/useFoodEntriesFilterStore';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './Loading';
import EmptyState from './EmptyState';
import FoodEntryItem from './FoodEntryItem';

export default function FoodEntriesList() {
  const { getQueryParams } = useFoodEntriesFilterStore();
  const filterParams = getQueryParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isLoading,
  } = useInfiniteFoodEntries(filterParams);

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'error' && error) {
    return <ErrorMessage error={error} />;
  }

  if (isLoading) {
    return <LoadingIndicator isLoading />;
  }

  const allEntries = data?.pages.flatMap((page) => page.entries) ?? [];

  if (allEntries.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ItemGroup className="space-y-2">
        {allEntries.map((entry) => (
          <div key={entry.id}>
            <FoodEntryItem entry={entry} />
          </div>
        ))}
        <ItemSeparator />
      </ItemGroup>

      <div ref={targetRef} className="h-4" />

      <LoadingIndicator isLoading={isFetchingNextPage} />

      {!hasNextPage && allEntries.length > 0 && (
        <div className="flex justify-center py-4">
          <span className="text-xs text-muted-foreground">
            No more food entries.
          </span>
        </div>
      )}
    </>
  );
}
