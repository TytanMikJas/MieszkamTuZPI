import { Button } from '@/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shadcn/dialog';

export default function ConfirmationModal({
  open,
  parcelData,
  handleConfirmChoice,
  handleClearParcel,
  handleModalClose,
  parcelLoading,
  editorLoading,
}: {
  open: boolean;
  parcelData: any;
  handleConfirmChoice: () => void;
  handleClearParcel: () => void;
  handleModalClose: () => void;
  parcelLoading: boolean;
  editorLoading: boolean;
}) {
  const handleOpenChanged = (open: boolean) => {
    if (!open) {
      handleModalClose();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChanged} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Potwierdź wybór działki</DialogTitle>
          <DialogDescription>
            Czy chcesz rozpocząć obliczenia dla działki
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between items-center gap-6 py-2">
          <div className="flex gap-4 font-bold text-xl justify-between">
            <div className="text-primary">{parcelData.parcelRegion}</div>
            <div className="text-gray-400">{parcelData.parcelNumber}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearParcel}>
            WYBIERZ INNĄ
          </Button>
          <Button onClick={handleConfirmChoice}>TAK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
