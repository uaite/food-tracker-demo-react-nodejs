import { Suspense } from 'react';
import TodayActivityCard from './TodayActivityCard';
import WeeklyComparisonCard from './WeeklyComparisonCard';
import AverageCaloriesCard from './AverageCaloriesCard';
import CardLoadingFallback from './CardLoadingFallback';

export default function Reports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Suspense fallback={<CardLoadingFallback title="Today's Activity" />}>
        <TodayActivityCard />
      </Suspense>

      <Suspense fallback={<CardLoadingFallback title="Weekly Comparison" />}>
        <WeeklyComparisonCard />
      </Suspense>

      <Suspense fallback={<CardLoadingFallback title="Average Calories" />}>
        <AverageCaloriesCard />
      </Suspense>
    </div>
  );
}
