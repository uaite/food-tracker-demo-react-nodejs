import { useWeeklyComparison } from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TodayActivityCard() {
  const { data: weeklyComparison } = useWeeklyComparison();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {weeklyComparison.today.count}
            </div>
            <p className="text-sm text-gray-600">entries added today</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
