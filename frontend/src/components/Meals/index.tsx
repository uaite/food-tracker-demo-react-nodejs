import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import MealsList from './MealsList';

export default function Meals() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meals</h1>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Spinner /> Loading meals...
          </div>
        }
      >
        <MealsList />
      </Suspense>
    </div>
  );
}
