// Admin-specific report types
export interface WeeklyComparisonResponse {
  today: {
    count: number;
    date: string;
  };
  thisWeek: {
    count: number;
    period: {
      from: string;
      to: string;
    };
  };
  previousWeek: {
    count: number;
    period: {
      from: string;
      to: string;
    };
  };
  comparison: {
    difference: number;
    percentageChange: string;
    trend: 'increase' | 'decrease' | 'no_change';
  };
}

export interface UserBreakdown {
  user: {
    id: string;
    name: string;
    email: string;
  };
  totalCalories: number;
  entryCount: number;
  averageCaloriesPerDay: number;
  averageCaloriesPerEntry: number;
}

export interface AverageCaloriesResponse {
  period: {
    from: string;
    to: string;
  };
  overallAverage: {
    averageCaloriesPerUser: number;
    averageCaloriesPerEntry: number;
    totalUsers: number;
    totalCalories: number;
  };
  userBreakdown: UserBreakdown[];
}
