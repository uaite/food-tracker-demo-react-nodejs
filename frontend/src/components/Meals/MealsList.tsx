import { useMeals } from '@/api';
import MealItem from './MealItem';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';

export default function MealsList() {
  const { data: meals, error } = useMeals();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!meals?.meals || meals.meals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meals.meals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
