import { useGlobalDialogStore } from '@/stores/useGlobalDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const sizeClassNames = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
};

export default function GlobalDialog() {
  const { isOpen, currentDialog, closeDialog } = useGlobalDialogStore();

  if (!currentDialog) {
    return null;
  }

  const {
    content: ContentComponent,
    props,
    title,
    size = 'md',
    showCloseButton,
  } = currentDialog;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent
        className={cn(sizeClassNames[size])}
        showCloseButton={showCloseButton}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <ContentComponent {...props} onClose={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
