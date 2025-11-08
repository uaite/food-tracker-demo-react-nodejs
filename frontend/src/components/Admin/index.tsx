import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import Reports from './Reports';
import AdminFoodEntries from './AdminFoodEntries';

export default function Admin() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Reports />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Spinner /> Loading food entries...
          </div>
        }
      >
        <AdminFoodEntries />
      </Suspense>
    </div>
  );
}
