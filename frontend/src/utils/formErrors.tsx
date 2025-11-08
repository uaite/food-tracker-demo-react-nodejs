import React from 'react';

type FormError = { message?: string } & Record<string, any>;

export function renderFormErrors(
  errors: (FormError | undefined)[]
): React.ReactElement | null {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-destructive space-y-1">
      {errors.map((error: FormError | undefined, index: number) => (
        <p key={index}>{error?.message || String(error)}</p>
      ))}
    </div>
  );
}

export function getFormErrorMessages(
  errors: (FormError | undefined)[]
): string[] {
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map(
    (error: FormError | undefined) => error?.message || String(error)
  );
}
