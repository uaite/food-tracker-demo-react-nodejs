import { useWeeklyComparison } from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function WeeklyComparisonCard() {
  const { data: weeklyComparison } = useWeeklyComparison();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>This Week:</strong> {weeklyComparison.thisWeek.count}{' '}
            entries
          </p>
          <p>
            <strong>Previous Week:</strong>{' '}
            {weeklyComparison.previousWeek.count} entries
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
