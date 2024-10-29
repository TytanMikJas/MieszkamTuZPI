import UserPublicDto from '@/core/api/admin/UserPublicDto';
import { useAdminStore } from '@/core/stores/admin-store';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import PanelButton from '@/reusable-components/panel-button/PanelButton';
import { Badge } from '@/shadcn/badge';
import { Button } from '@/shadcn/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/shadcn/dialog';
import { Input } from '@/shadcn/input';
import { Label } from '@/shadcn/label';
import { useEffect, useState } from 'react';
import NewPasswordDetails from './NewPasswordDetails';

export default function GeneratePassword({ user }: { user: UserPublicDto }) {
  const {
    clearPasswordGeneration,
    generatePassworadLoading,
    patchGeneratePassword,
    newPassword,
  } = useAdminStore();

  const [confirmation, setConfirmation] = useState<boolean>(false);
  const handleConfirm = () => {
    setConfirmation(true);
  };

  useEffect(() => {
    return () => {
      clearPasswordGeneration();
      setConfirmation(false);
    };
  }, []);

  const isPasswordSet = newPassword !== null;

  return (
    <Dialog onOpenChange={clearPasswordGeneration}>
      <DialogTrigger asChild>
        <PanelButton icon={'lock_reset'} text="Generuj hasło" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {generatePassworadLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20">
            <PanelLoader />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {isPasswordSet ? 'Zresetowano hasło' : 'Generowanie hasła'}
          </DialogTitle>
          <DialogDescription>
            {isPasswordSet
              ? `Hasło zostało zresetowane dla użytkownika ${user.firstName} ${user.lastName}.`
              : `Czy na pewno chcesz zresetować hasło użytkownikowi ${user.firstName} ${user.lastName}?`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isPasswordSet ? (
            <NewPasswordDetails newPassword={newPassword} />
          ) : (
            <Button onClick={patchGeneratePassword} variant="link">
              Generuj nowe hasło
            </Button>
          )}
        </div>
        <DialogFooter>
          {isPasswordSet ? (
            !confirmation ? (
              <Button onClick={handleConfirm} variant="secondary">
                Ok
              </Button>
            ) : (
              <DialogClose>
                <Button>Potwierdź</Button>
              </DialogClose>
            )
          ) : (
            <DialogClose>
              <Button variant="destructive">Anuluj</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
