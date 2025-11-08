import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import FoodEntries from '@/components/FoodEntries';

export const Route = createFileRoute('/')({
  component: FoodEntriesPage,
});

function FoodEntriesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            There was an error: {error.message}
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Spinner /> Loading food entries...
            </div>
          }
        >
          <FoodEntries />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
