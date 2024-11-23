import { useForgotPasswordStore } from '@/core/stores/forgot-password-store';
import ButtonWithLoader from '@/reusable-components/buttons/ButtonWithLoader';
import { PasswordInput } from '@/reusable-components/password-input/PasswordInput';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

type Props = {
  onSubmit: (newPassword: string) => void;
};

export const passwordSchema = z
  .string()
  .min(8, 'Hasło musi mieć przynajmniej 8 znaków')
  .refine(
    (password: string) => /[a-z]/.test(password),
    'Hasło musi zawierać przynajmniej jedną małą literę',
  )

  .refine(
    (password: string) => /[A-Z]/.test(password),

    'Hasło musi zawierać przynajmniej jedną wielką literę',
  )
  .refine(
    (password: string) => /[0-9]/.test(password),
    'Hasło musi zawierać przynajmniej jedną cyfrę',
  )
  .refine(
    (password: string) => /[\W_]/.test(password),
    'Hasło musi zawierać przynajmniej jeden symbol',
  );

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą się zgadzać',
    path: ['confirmPassword'],
  });

function ForgotPasswordForm({ onSubmit }: Props) {
  const [searchParams] = useSearchParams();
  const { handleSubmit, register, formState } = useForm<z.infer<typeof schema>>(
    {
      resolver: zodResolver(schema),
    },
  );
  const store = useForgotPasswordStore();

  const onSaveClick = () => {
    handleSubmit(
      (data) => {
        onSubmit(data.password);
      },
      () => {},
    )();
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-col items-center justify-center text-2xl font-bold text-center leading-none">
          Zmiana hasła
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          <PasswordInput
            {...register('password')}
            placeholder="Nowe hasło"
            autoComplete="new-password"
            className="mt-5"
          />
          {formState.errors.password ? (
            <p className="text-red-500 text-sm">
              {formState.errors.password.message}
            </p>
          ) : (
            <p className="text-sm">ㅤ</p>
          )}
          <PasswordInput
            {...register('confirmPassword')}
            placeholder="Powtórz nowe hasło"
            autoComplete="new-password"
            className="mt-5"
          />
          {formState.errors.confirmPassword ? (
            <p className="text-red-500 text-sm">
              {formState.errors.confirmPassword.message}
            </p>
          ) : (
            <p className="text-sm">ㅤ</p>
          )}
        </div>
        <div className="flex flex-row flex-grow-0 justify-center ">
          <ButtonWithLoader
            className="w-32 mt-8"
            onClick={onSaveClick}
            isLoading={store.passwordChanged.loading}
          >
            Zapisz
          </ButtonWithLoader>
        </div>
      </CardContent>
    </Card>
  );
}

export default ForgotPasswordForm;
