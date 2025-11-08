import { useAverageCalories } from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AverageCaloriesCard() {
  const { data: averageCalories } = useAverageCalories();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Total Users:</strong>{' '}
            {averageCalories.overallAverage.totalUsers}
          </p>
          <p>
            <strong>Avg per User:</strong>{' '}
            {averageCalories.overallAverage.averageCaloriesPerUser} cal
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
