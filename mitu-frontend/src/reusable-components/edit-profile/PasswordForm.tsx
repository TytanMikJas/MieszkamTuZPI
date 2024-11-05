import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../shadcn/button';
import { Label } from '../../shadcn/label';
import PasswordHint from '../registration-form/PasswordHint';
import { useAuthStore } from '@/core/stores/auth-store';
import { UpdateUserPasswordInputDto } from '@/core/api/auth/dto/editUser';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '../password-input/PasswordInput';

const passwordSchema = z
  .string()
  .min(8, 'Hasło musi mieć przynajmniej 8 znaków')
  .refine(
    (password) => /[a-z]/.test(password),
    'Hasło musi zawierać przynajmniej jedną małą literę',
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    'Hasło musi zawierać przynajmniej jedną wielką literę',
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Hasło musi zawierać przynajmniej jedną cyfrę',
  )
  .refine(
    (password) => /[\W_]/.test(password),
    'Hasło musi zawierać przynajmniej jeden symbol',
  );

const editPasswordFormSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hasła muszą się zgadzać',
    path: ['confirmPassword'],
  });

export default function PasswordForm() {
  const { me, updateUserPassword, logOut, error } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof editPasswordFormSchema>>({
    resolver: zodResolver(editPasswordFormSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      useAuthStore.setState({ error: null });
    };
  }, [error]);

  const renderError = (fieldName: keyof typeof errors) => {
    const error = errors[fieldName];
    return error ? (
      <p className="text-red-500 text-sm">{error.message}</p>
    ) : (
      <p className="text-sm">ㅤ</p>
    );
  };

  function onSubmit(values: z.infer<typeof editPasswordFormSchema>) {
    const registerRequest: UpdateUserPasswordInputDto = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    updateUserPassword(registerRequest, () => {
      logOut();
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
    >
      <Label className="pb-1" htmlFor="first-name">
        Aktualne hasło
      </Label>
      <PasswordInput
        {...register('oldPassword')}
        placeholder="Aktualne hasło"
        className="select-none"
      />
      {renderError('oldPassword')}
      <div className="flex space-x-1">
        <Label className="pb-1" htmlFor="first-name">
          Nowe hasło
        </Label>
        <PasswordHint />
      </div>
      <PasswordInput
        {...register('newPassword')}
        placeholder="Nowe hasło"
        className="select-none"
      />
      {renderError('newPassword')}
      <Label className="pb-1" htmlFor="first-name">
        Powtórz nowe hasło
      </Label>
      <PasswordInput
        {...register('confirmPassword')}
        placeholder="Powtórz nowe hasło"
        className="select-none"
      />
      {renderError('confirmPassword')}
      <Button type="submit" className="w-full mt-2 uppercase">
        zapisz zmiany
      </Button>
    </form>
  );
}
