export default function ErrorMessage({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-center">
        <p className="text-sm text-destructive font-medium">
          Failed to load food entries
        </p>
        <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      </div>
    </div>
  );
}
