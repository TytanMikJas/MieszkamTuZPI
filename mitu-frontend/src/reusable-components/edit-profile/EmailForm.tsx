import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../../shadcn/input';
import { Button } from '../../shadcn/button';
import { Label } from '../../shadcn/label';
import { useAuthStore } from '@/core/stores/auth-store';
import { UpdateUserEmailInputDto } from '@/core/api/auth/dto/editUser';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PasswordInput } from '../password-input/PasswordInput';

const editEmailFormSchema = z
  .object({
    password: z.string(),
    email: z.string().email('Niepoprawny adres email'),
    confirmEmail: z.string(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Maile muszą się zgadzać',
    path: ['confirmEmail'],
  });

export default function EmailForm() {
  const { updateUserEmail, logOut, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof editEmailFormSchema>>({
    resolver: zodResolver(editEmailFormSchema),
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
    const fieldError = errors[fieldName];
    return fieldError ? (
      <p className="text-red-500 text-sm">{fieldError.message}</p>
    ) : (
      <p className="text-sm">ㅤ</p>
    );
  };

  function onSubmit(values: z.infer<typeof editEmailFormSchema>) {
    const registerRequest: UpdateUserEmailInputDto = {
      password: values.password,
      email: values.email,
    };
    updateUserEmail(registerRequest, () => {
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
        Hasło
      </Label>
      <PasswordInput
        {...register('password')}
        placeholder="Hasło"
        className="select-none"
      />
      {renderError('password')}
      <Label className="pb-1" htmlFor="first-name">
        Nowy email
      </Label>
      <Input
        {...register('email')}
        type="email"
        placeholder="annakowalska@example.com"
      />
      {renderError('email')}
      <Label className="pb-1" htmlFor="first-name">
        Powtórz nowy email
      </Label>
      <Input
        {...register('confirmEmail')}
        type="email"
        placeholder="annakowalska@example.com"
      />
      {renderError('confirmEmail')}
      <Button type="submit" className="w-full mt-2 uppercase">
        zapisz zmiany
      </Button>
    </form>
  );
}
