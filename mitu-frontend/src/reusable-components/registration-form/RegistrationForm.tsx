import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../shadcn/input';
import { Button } from '../../shadcn/button';
import { Label } from '../../shadcn/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card';
import { CreateUserInputDto } from '../../core/api/auth/dto/register';
import { useAuthStore } from '../../core/stores/auth-store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../core/routing/Router';
import ControlledCheckbox from './ControlledCheckbox';
import PasswordHint from './PasswordHint';
import { PasswordInput } from '../password-input/PasswordInput';

type Props = {};

export const passwordSchema = z
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

const registrationFormSchema = z
  .object({
    name: z.string().min(3, 'Imię jest wymagane'),
    surname: z.string().min(3, 'Nazwisko jest wymagane'),
    email: z.string().email('Niepoprawny adres email'),
    password: passwordSchema,
    confirmPassword: z.string(),
    newsletter: z.boolean().optional(),
    user_agreement: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą się zgadzać',
    path: ['confirmPassword'],
  })
  .refine((data) => data.user_agreement === true, {
    message: 'Musisz zaakceptować regulamin',
    path: ['user_agreement'],
  });

export default function RegistrationForm({}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
  });

  const { signUp, loading, error } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      if (error.field === 'email') {
        control.setError('email', {
          type: 'manual',
          message: error.message,
        });
      } else {
        toast.error(error.message);
      }
    }
  }, [error]);

  function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    const registerRequest: CreateUserInputDto = {
      firstName: values.name,
      lastName: values.surname,
      email: values.email,
      password: values.password,
      newsletter_agreement: values.newsletter ?? false,
    };
    signUp(registerRequest, () => {
      toast.success('Rejestracja zakończona pomyślnie');
      setTimeout(() => {
        navigate(ROUTES.MAP.LOGIN.path());
      }, 1000);
    });
  }

  const renderError = (fieldName: keyof typeof errors) => {
    const error = errors[fieldName];
    return error ? (
      <p className="text-red-500 text-sm">{error.message}</p>
    ) : (
      <p className="text-sm">ㅤ</p>
    );
  };
  return (
    <>
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Rejestracja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            <Label className="pb-1" htmlFor="first-name">
              Imię
            </Label>
            <Input
              {...register('name')}
              placeholder="Anna"
              autoComplete="given-name"
            />
            {renderError('name')}
            <Label className="pb-1" htmlFor="first-name">
              Nazwisko
            </Label>
            <Input
              {...register('surname')}
              placeholder="Kowalska"
              autoComplete="family-name"
            />
            {renderError('surname')}
            <Label className="pb-1" htmlFor="first-name">
              Email
            </Label>
            <Input
              {...register('email')}
              placeholder="annakowalska@example.com"
              autoComplete="email"
            />
            {renderError('email')}
            <div className="flex space-x-1">
              <Label className="pb-1" htmlFor="first-name">
                Hasło
              </Label>
              <PasswordHint />
            </div>
            <PasswordInput
              {...register('password')}
              placeholder="Hasło"
              className="select-none"
              autoComplete="new-password"
            />
            {renderError('password')}
            <Label className="pb-1" htmlFor="first-name">
              Powtórz hasło
            </Label>
            <PasswordInput
              {...register('confirmPassword')}
              placeholder="Powtórz hasło"
              className="select-none"
            />
            {renderError('confirmPassword')}
            <div className="flex flex-col space-y-3 pb-4">
              <div className="flex items-center space-x-2">
                <ControlledCheckbox
                  control={control}
                  name="user_agreement"
                  defaultValue={false}
                  rules={{ required: true }}
                />
                <Label htmlFor="regulamin" className="pr-4">
                  Akceptuję zasady
                </Label>
                <Button className="h-3 w-12" variant={'link'} type="button">
                  regulaminu
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <ControlledCheckbox
                  control={control}
                  name="newsletter"
                  defaultValue={false}
                  rules={{ required: false }}
                />
                <Label htmlFor="email">
                  Chcę otrzymywać e-maile o aktualnościach
                </Label>
              </div>
            </div>
            {renderError('user_agreement')}
            <Button type="submit" className="w-full">
              ZAREJESTRUJ SIĘ
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
