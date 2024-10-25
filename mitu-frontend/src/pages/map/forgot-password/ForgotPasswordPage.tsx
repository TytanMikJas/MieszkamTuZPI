import React, { useEffect } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useForgotPasswordStore } from '@/core/stores/forgot-password-store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '@/reusable-components/loaders/Loader';
import { Button } from '@/shadcn/button';
import { ROUTES } from '@/core/routing/Router';

type Props = {};

function ForgotPasswordPage({}: Props) {
  const navigate = useNavigate();
  const store = useForgotPasswordStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    if (token) {
      store.validateToken(token);
    }
  }, [token]);

  if (store.tokenValid.loading) {
    return (
      <div className="flex justify-center items-center w-full mt-5">
        <Loader />
      </div>
    );
  }
  console.log(store.tokenValid.value);

  if (!store.tokenValid.value) {
    return (
      <div className="text-center m-5">
        <p className="text-xl font-bold">Link wygasł</p>
        <p className="text-lg mt-5 text-justify">
          Link do resetowania hasła wygasł. Przejdź na stronę logowania i
          wygeneruj go ponownie, bądź zaloguj się nowo ustawionym hasłem.
        </p>
        <div>
          <Button
            className="mt-5"
            onClick={() => {
              navigate(ROUTES.MAP.LOGIN.path(), { replace: true });
            }}
          >
            Przejdź do logowania
          </Button>
        </div>
      </div>
    );
  }

  if (store.tokenValid.value) {
    return (
      <ForgotPasswordForm
        onSubmit={(password) =>
          store.changePassword(token!, password, () => {
            navigate(ROUTES.MAP.LOGIN.path(), { replace: true });
          })
        }
      />
    );
  }
}

export default ForgotPasswordPage;
