import { Input } from '@/shadcn/input';
import { Label } from '@/shadcn/label';
import { useRef } from 'react';
import { z } from 'zod';
import { passwordSchema } from '../registration-form/RegistrationForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shadcn/button';
import { PasswordInput } from '../password-input/PasswordInput';
import { useAuthStore } from '@/core/stores/auth-store';
import PanelLoader from '../loaders/PanelLoader';

export default function ForceResetPassword() {
  const { forceResetPassword, loading } = useAuthStore();

  const changePasswordFormSchema = z
    .object({
      oldPassword: z.string(),
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Hasła muszą się zgadzać',
      path: ['confirmPassword'],
    });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  function onSubmit(values: z.infer<typeof changePasswordFormSchema>) {
    forceResetPassword(values.oldPassword, values.password);
  }

  const renderError = (fieldName: keyof typeof errors) => {
    const error = errors[fieldName];
    return error ? (
      <p className="text-red-500 text-sm">{error.message}</p>
    ) : (
      <p className="text-sm"></p>
    );
  };

  return (
    <div className="absolute z-[40000000001] top-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-20 w-full h-full">
      <div className="max-w-96 bg-white rounded-lg shadow flex flex-col gap-2 p-4 relative">
        {loading && (
          <div className="absolute rounded-lg right-0 top-0 w-full h-full bg-black bg-opacity-10 z-[40000000002]">
            <PanelLoader />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">Zmiana hasła</div>
          <div className="text-sm text-justify">
            Hasło do twojego konta zostało zresetowane. Utwórz nowe hasło, aby
            kontynuować.
          </div>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            <Label htmlFor="old_pass">Wygenerowane hasło</Label>
            <PasswordInput
              id="old_pass"
              className="select-none"
              {...register('oldPassword')}
            />
            {renderError('oldPassword')}
            <Label htmlFor="new_password">Nowe hasło</Label>
            <PasswordInput
              id="new_password"
              className="select-none"
              {...register('password')}
            />
            {renderError('password')}
            <Label htmlFor="new_password2">Powtórz nowe hasło</Label>
            <PasswordInput
              id="new_password2"
              {...register('confirmPassword')}
              className="select-none"
            />
            {renderError('confirmPassword')}
            <Button className="w-full my-4" type="submit">
              Zmień hasło
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
