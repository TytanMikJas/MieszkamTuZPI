import { ROUTES } from '@/core/routing/Router';
import { Button } from '@/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/dialog';
import { useNavigate } from 'react-router-dom';

export default function LoginDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const handleIsOpenChanged = (value: boolean) => {
    if (value === false) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(ROUTES.MAP.LOGIN.path());
  };

  return (
    <Dialog onOpenChange={handleIsOpenChanged} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Czy chcesz się zalogować?</DialogTitle>
          <DialogDescription>
            Aby wykonać tą czynność musisz być zalogowany.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">ANULUJ</Button>
          </DialogClose>
          <Button onClick={handleRedirect}>ZALOGUJ SIĘ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
