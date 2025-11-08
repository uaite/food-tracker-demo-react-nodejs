import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: Error;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-red-500">
      <AlertCircle className="h-16 w-16 mb-4 text-red-300" />
      <h3 className="text-lg font-medium mb-2">Error loading meals</h3>
      <p className="text-sm text-center max-w-md text-red-400">
        {error.message ||
          'Something went wrong while loading meals. Please try again.'}
      </p>
    </div>
  );
}
