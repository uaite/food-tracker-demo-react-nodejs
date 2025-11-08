import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface CardLoadingFallbackProps {
  title: string;
}

export default function CardLoadingFallback({
  title,
}: CardLoadingFallbackProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-24 text-gray-500">
          <Spinner className="w-6 h-6" />
          <span className="text-sm mt-2">Loading...</span>
        </div>
      </CardContent>
    </Card>
  );
}
