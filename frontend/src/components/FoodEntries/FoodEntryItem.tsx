import { formatEntryDateTime, formatCalories } from '@/utils/format';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import type { FoodEntry } from '@/api/shared/types';

interface FoodEntryItemProps {
  entry: FoodEntry;
}

export default function FoodEntryItem({ entry }: FoodEntryItemProps) {
  return (
    <Item variant="outline" className="hover:bg-accent/50">
      <ItemContent>
        <ItemTitle>{entry.foodName}</ItemTitle>
        <ItemDescription>
          {entry.meal.name} • {formatEntryDateTime(entry.entryDateTime)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-sm font-medium text-muted-foreground">
          {formatCalories(entry.calories)}
        </span>
      </ItemActions>
    </Item>
  );
}
