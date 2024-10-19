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
import sendMailIcon from '@/lordicon/sendMail.json';
import { Input } from '@/shadcn/input';
import React, { useEffect } from 'react';
import IconPlayOnce from '../lordicon/IconPlayOnce';
import { useAuthStore } from '@/core/stores/auth-store';
import { Button } from '@/shadcn/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {};

const forgotPasswordFormSchema = z.object({
  email: z.string().email('Niepoprawny format adresu email'),
});

function ForgotPasswordDialog({}: Props) {
  const { handleSubmit, register } = useForm<
    z.infer<typeof forgotPasswordFormSchema>
  >({
    resolver: zodResolver(forgotPasswordFormSchema),
  });
  const { createForgotPasswordToken } = useAuthStore();
  const [error, setError] = React.useState({ message: '' });
  const [sent, setSent] = React.useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setError({ message: '' });
          setSent(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="text-gray-500 underline">
          Zapomniałeś hasła?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="">
          <DialogTitle>Reset hasła</DialogTitle>
          <DialogDescription>
            Wpisz poniżej swój adres email, a my wyślemy Ci link do zresetowania
            hasła.
            <div className="flex justify-center">
              <IconPlayOnce
                icon={sendMailIcon}
                sizes={{ sm: 100, md: 150, lg: 150 }}
              ></IconPlayOnce>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1">
            <Input {...register('email')} id="email" type="email" />
            {error?.message ? (
              <p className="text-red-500 text-sm">{error.message}</p>
            ) : (
              <p className="text-sm">ㅤ</p>
            )}
          </div>

          <Button
            type="submit"
            size="sm"
            className="px-3 self-baseline"
            onClick={() => {
              handleSubmit(
                (data) => {
                  setError({ message: '' });

                  createForgotPasswordToken(data.email);
                  setSent(true);
                },
                (e) => {
                  setError({ message: e.email?.message ?? '' });
                },
              )();
            }}
          >
            Wyślij
          </Button>
        </div>
        <div>
          {sent ? (
            <p className="text-center m-auto text-xl">
              Link do resetowania twojego hasła został wysłany na pocztę e-mail.
              Sprawdź swoją skrzynkę.
            </p>
          ) : null}
        </div>
        <DialogFooter className="sm:justify-start pt-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Zamknij
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
