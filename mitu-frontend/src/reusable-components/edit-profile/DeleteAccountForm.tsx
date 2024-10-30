import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../shadcn/button';
import { Label } from '../../shadcn/label';
import { useAuthStore } from '@/core/stores/auth-store';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DeleteAccountInputDto } from '@/core/api/auth/dto/editUser';
import { PasswordInput } from '../password-input/PasswordInput';

const deleteAccountFormSchema = z.object({
  password: z.string(),
});

export default function DeleteAccountForm() {
  const { deleteUserAccount, logOut, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof deleteAccountFormSchema>>({
    resolver: zodResolver(deleteAccountFormSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  function onSubmit(values: z.infer<typeof deleteAccountFormSchema>) {
    const registerRequest: DeleteAccountInputDto = {
      password: values.password,
    };
    deleteUserAccount(registerRequest, () => {
      logOut();
      return () => {
        useAuthStore.setState({ error: null });
      };
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
      <Button type="submit" className="w-full mt-8 uppercase">
        usuń konto
      </Button>
    </form>
  );
}
