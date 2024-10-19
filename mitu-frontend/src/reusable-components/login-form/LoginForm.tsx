import { Card, CardHeader, CardTitle, CardContent } from '../../shadcn/card';
import { Input } from '../../shadcn/input';
import { Divider } from '../authentication/Divider';
import { Button } from '../../shadcn/button';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../core/routing/Router';
import { useAuthStore } from '../../core/stores/auth-store';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../shadcn/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import IconPlayOnce from '@/reusable-components/lordicon/IconPlayOnce';
import avatarIcon from '@/lordicon/avatar.json';
import ForgotPasswordDialog from '../forgot-password-dialog/ForgotPasswordDialog';

const loginFormSchema = z.object({
  email: z.string().email('Niepoprawny format adresu email'),
  password: z.string().min(8, 'Hasło musi mieć przynajmniej 8 znaków'),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { me, signIn, error, loading, createForgotPasswordToken } =
    useAuthStore();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  function onLoginSubmit(data: z.infer<typeof loginFormSchema>) {
    signIn(data.email, data.password, () => navigate(-1));
  }

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-col items-center justify-center text-2xl font-bold text-center leading-none">
          Logowanie
          <IconPlayOnce
            icon={avatarIcon}
            sizes={{ sm: 100, md: 150, lg: 150 }}
          ></IconPlayOnce>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center justify-center">
          <Form {...form}>
            <form
              className="w-full max-w-sm"
              onSubmit={form.handleSubmit(onLoginSubmit)}
            >
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" id="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Hasło"
                          type="password"
                          id="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-2">
                <ForgotPasswordDialog />
              </div>

              <div className="mb-4">
                <Button variant={'default'} className="w-full">
                  ZALOGUJ SIĘ
                </Button>
              </div>
              <div>
                <Divider text="lub" />
              </div>
              <div className="mt-4">
                <Button
                  variant={'secondary'}
                  className="w-full"
                  onClick={() => navigate(ROUTES.MAP.REGISTER.path())}
                >
                  ZAŁÓŻ KONTO
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
