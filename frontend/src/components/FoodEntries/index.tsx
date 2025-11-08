import { Suspense } from 'react';
import LoadingIndicator from './Loading';
import AddFoodEntryButton from './AddFoodEntryButton';
import Filters from './Filters';
import FoodEntriesList from './FoodEntriesList';
import { useDailyTotals } from '@/api';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function FoodEntries() {
  const { data: dailyData } = useDailyTotals();

  const reachedCalorieLimit =
    dailyData &&
    (dailyData?.currentTotalCalories ?? 0) >= dailyData?.dailyCalorieLimit;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 justify-between sm:items-center sm:flex-row">
        <h1 className="text-2xl font-bold mb-6 sm:mb-0">Food Entries</h1>
        <AddFoodEntryButton />
      </div>

      <Alert
        variant="warning"
        className={`${reachedCalorieLimit ? 'block' : 'hidden'}`}
      >
        <AlertTitle>Calorie Limit Reached</AlertTitle>
        <AlertDescription>
          You have reached your daily calorie limit. Be mindful of your eating
          habits!
        </AlertDescription>
      </Alert>

      <Filters />

      <Suspense fallback={<LoadingIndicator isLoading />}>
        <FoodEntriesList />
      </Suspense>
    </div>
  );
}
