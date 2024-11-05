import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../shadcn/input';
import { Button } from '../../shadcn/button';
import { Label } from '../../shadcn/label';
import ControlledCheckbox from '../registration-form/ControlledCheckbox';
import { useAuthStore } from '@/core/stores/auth-store';
import { UpdateUserInfoInputDto } from '@/core/api/auth/dto/editUser';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/routing/Router';
import { useForm } from 'react-hook-form';

const editProfileFormSchema = z.object({
  name: z.string().min(3, 'Imię jest wymagane'),
  surname: z.string().min(3, 'Nazwisko jest wymagane'),
  newsletter: z.boolean().optional(),
});

export default function AccountForm({ onClose }) {
  const { me, updateUserInfo } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: me?.firstName,
      surname: me?.lastName,
      newsletter: me?.newsletter_agreement,
    },
  });

  const renderError = (fieldName: keyof typeof errors) => {
    const error = errors[fieldName];
    return error ? (
      <p className="text-red-500 text-sm">{error.message}</p>
    ) : (
      <p className="text-sm">ㅤ</p>
    );
  };

  function onSubmit(values: z.infer<typeof editProfileFormSchema>) {
    const registerRequest: UpdateUserInfoInputDto = {
      firstName: values.name,
      lastName: values.surname,
      newsletter_agreement: values.newsletter ?? false,
    };
    updateUserInfo(registerRequest, () => {
      onClose();
      setTimeout(() => {
        navigate(ROUTES.MAP.LANDING_PAGE.path());
      }, 1000);
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
      <div className="flex flex-col space-y-3 pb-6 pt-2">
        <div className="flex items-center space-x-2">
          <ControlledCheckbox
            control={control}
            name="newsletter"
            rules={{ required: false }}
            defaultValue={me?.newsletter_agreement}
          />
          <Label htmlFor="email">
            Chcę otrzymywać e-maile o aktualnościach
          </Label>
        </div>
      </div>
      <Button type="submit" className="w-full uppercase">
        zapisz zmiany
      </Button>
    </form>
  );
}
