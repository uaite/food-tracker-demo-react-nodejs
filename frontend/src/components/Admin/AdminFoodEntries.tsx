import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteFoodEntries } from '@/api/food-entries';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import EmptyState from '@/components/FoodEntries/EmptyState';
import ErrorMessage from '@/components/FoodEntries/ErrorMessage';
import LoadingIndicator from '@/components/FoodEntries/Loading';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import AdminFoodEntryItem from './AdminFoodEntryItem';

export default function AdminFoodEntries() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isLoading,
  } = useInfiniteFoodEntries({ allUsers: true });

  const parentRef = useRef<HTMLDivElement>(null);
  const allEntries = data?.pages.flatMap((page) => page.entries) ?? [];

  const virtualizer = useVirtualizer({
    count: allEntries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Intersection observer for infinite loading
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Trigger loading more when approaching the end of virtual items
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem &&
      lastItem.index >= allEntries.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    allEntries.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (status === 'error' && error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Food Entries</h2>
          <ErrorMessage error={error} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Food Entries</h2>
          <LoadingIndicator isLoading />
        </div>
      </div>
    );
  }

  const totalEntries = data?.pages[0]?.pagination.total ?? 0;

  if (allEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Food Entries</h2>
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Food Entries</h2>
          <div className="text-sm text-gray-500">
            {totalEntries} total entries
          </div>
        </div>

        {/* Virtualized list container with viewport-based height */}
        <div
          ref={parentRef}
          className="w-full overflow-auto"
          style={{
            height: 'calc(100vh - 200px)',
            minHeight: '400px',
            maxHeight: '80vh',
          }}
        >
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            <ItemGroup>
              {virtualItems.map((virtualItem) => {
                const entry = allEntries[virtualItem.index];
                if (!entry) return null;

                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <AdminFoodEntryItem entry={entry} />
                    {virtualItem.index < allEntries.length - 1 && (
                      <ItemSeparator className="mt-2" />
                    )}
                  </div>
                );
              })}
            </ItemGroup>
          </div>
        </div>

        {/* Infinite loading trigger */}
        <div ref={targetRef} className="h-4" />

        <LoadingIndicator isLoading={isFetchingNextPage} />

        {!hasNextPage && allEntries.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-xs text-muted-foreground">
              No more food entries.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
