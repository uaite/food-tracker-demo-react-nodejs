import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-primary/20',
        green: 'bg-emerald-200 dark:bg-emerald-900/30',
        red: 'bg-red-300 dark:bg-red-900/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const progressIndicatorVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      green: 'bg-emerald-500 dark:bg-emerald-400',
      red: 'bg-red-600 dark:bg-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Progress({
  className,
  variant,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ variant, className }))}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={progressIndicatorVariants({ variant })}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
