import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthMe, useDailyTotals } from '@/api';
import { Link } from '@tanstack/react-router';
import { Progress } from '@/components/ui/progress';

export default function HeaderAvatar() {
  const { data: userData } = useAuthMe();
  const { data: dailyData } = useDailyTotals();

  const userInitials = userData?.user.name
    ? userData.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const calorieProgress =
    (dailyData &&
      (dailyData.currentTotalCalories ?? 0) / dailyData.dailyCalorieLimit) ??
    0;

  return (
    <div className="flex items-center space-x-4">
      {dailyData && (
        <div className="flex flex-col items-end gap-0.5">
          <Progress
            value={Math.min(calorieProgress * 100, 100)}
            variant={calorieProgress > 0.9 ? 'red' : 'default'}
            className="w-24 h-2"
          />
          <p className="text-sm text-gray-600">
            Calories Today: {dailyData.currentTotalCalories ?? 0} /{' '}
            {dailyData.dailyCalorieLimit || 0}
          </p>
        </div>
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 transition-colors cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={userData?.user.name || 'User'} />
              <AvatarFallback className="text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {userData?.user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">{userData?.user.email}</p>
            </div>
          </DropdownMenuLabel>

          {userData?.user.role === 'ADMIN' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/admin"
                  className="w-full cursor-pointer text-blue-600"
                >
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
