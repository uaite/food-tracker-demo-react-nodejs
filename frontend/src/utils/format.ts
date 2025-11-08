import {
  differenceInDays,
  format,
  formatDistance,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';

export function formatEntryDateTime(dateTimeString: string): string {
  const date = parseISO(dateTimeString);

  if (isToday(date)) {
    return `Today at ${format(date, 'p')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'p')}`;
  }

  // For dates within the last week, show relative time
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff > 1 && daysDiff <= 7) {
    const daysAgo = formatDistance(date, new Date(), { addSuffix: true });
    return `${daysAgo} at ${format(date, 'p')}`;
  }

  // For older dates, show full date and time
  return format(date, 'PPPp');
}

export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} cal`;
}
