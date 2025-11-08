import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spinner } from '@/components/ui/spinner';
import Meals from '@/components/Meals';

export const Route = createFileRoute('/meals')({
  component: MealsPage,
});

function MealsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="flex flex-col items-center justify-center py-16 text-red-500">
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-sm text-center max-w-md text-red-400 mb-4">
              {error.message}
            </p>
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Spinner /> Loading meals...
            </div>
          }
        >
          <Meals />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
