import { Spinner } from '../ui/spinner';

interface LoadingIndicatorProps {
  isLoading?: boolean;
}

export default function LoadingIndicator({ isLoading }: LoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center items-center py-4">
      <Spinner className="h-6 w-6" />
      <span className="ml-2 text-sm text-muted-foreground">
        Loading more entries...
      </span>
    </div>
  );
}
