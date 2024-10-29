import { useAdminStore } from '@/core/stores/admin-store';
import {
  MIN_LENGTH_USER_FIRST_NAME,
  MAX_LENGTH_USER_FIRST_NAME,
  MIN_LENGTH_USER_LAST_NAME,
  MAX_LENGTH_USER_LAST_NAME,
  MAX_LENGTH_USER_EMAIL,
  MIN_LENGTH_USER_EMAIL,
} from '@/max-lengths';
import CrossIcon from '@/reusable-components/icons/cross-icon/CrossIcon';
import { Button } from '@/shadcn/button';
import { Input } from '@/shadcn/input';
import { Label } from '@/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/select';
import {
  ADMIN_NONE_STAGE,
  USER_ROLE_LABEL_ADMIN,
  USER_ROLE_LABEL_OFFICIAL,
  USER_ROLE_NAME_ADMIN,
  USER_ROLE_NAME_OFFICIAL,
} from '@/strings';
import { emitError } from '@/toast-actions';
import { userRoleParserReverse } from '@/utils';
import { useRef } from 'react';
import NewPasswordDetails from './NewPasswordDetails';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';

export default function UserCreate() {
  const ln_ref = useRef<any>(null);
  const fn_ref = useRef<any>(null);
  const em_ref = useRef<any>(null);
  const r_ref = useRef<any>(null);
  const {
    setStage,
    clearPasswordGeneration,
    newPassword,
    postCreateUser,
    createLoading,
  } = useAdminStore();

  const handleResetPasswordValue = () => {
    clearPasswordGeneration();
  };

  const handleCloseStage = () => {
    setStage(ADMIN_NONE_STAGE, handleResetPasswordValue);
  };

  const isPasswordSet = newPassword !== null;

  const handleSubmit = () => {
    const firstName = fn_ref.current?.value;
    const lastName = ln_ref.current?.value;
    const email = em_ref.current?.value;
    const role = r_ref.current?.innerHTML;
    console.log({ firstName, lastName, email, role });
    if (
      !firstName ||
      firstName.length < MIN_LENGTH_USER_FIRST_NAME ||
      firstName.length > MAX_LENGTH_USER_FIRST_NAME
    ) {
      emitError('Nieprawidłowe imię');
      return;
    }

    if (
      !lastName ||
      lastName.length < MIN_LENGTH_USER_LAST_NAME ||
      lastName.length > MAX_LENGTH_USER_LAST_NAME
    ) {
      emitError('Nieprawidłowe nazwisko');
      return;
    }

    if (
      !email ||
      email.length < MIN_LENGTH_USER_EMAIL ||
      email.length > MAX_LENGTH_USER_EMAIL
    ) {
      emitError('Nieprawidłowy email');
      return;
    }
    if (
      !role ||
      (userRoleParserReverse[role] !== USER_ROLE_NAME_ADMIN &&
        userRoleParserReverse[role] !== USER_ROLE_NAME_OFFICIAL)
    ) {
      emitError('Nieprawidłowa rola');
      return;
    }
    const dto = {
      firstName,
      lastName,
      email,
      role: userRoleParserReverse[role],
    };

    postCreateUser(dto);
  };
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full h-full relative">
      <div className="absolute right-0 top-0">
        <CrossIcon size={40} onClick={handleCloseStage} />
      </div>
      {createLoading && (
        <div className="absolute right-0 top-0 w-full h-full z-[1000]">
          <PanelLoader />
        </div>
      )}
      <div className="flex flex-col gap-2 min-w-96">
        <Label htmlFor="firstName">Imię</Label>
        <Input ref={fn_ref} id="firstName" />
        <Label htmlFor="lastName">Nazwisko</Label>
        <Input ref={ln_ref} id="lastName" />
        <Label htmlFor="email">Email</Label>
        <Input ref={em_ref} id="email" />
        <Label htmlFor="role">Rola</Label>
        <Select id="role">
          <SelectTrigger>
            <SelectValue ref={r_ref} placeholder="Wybierz rolę" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={USER_ROLE_NAME_OFFICIAL}>
              {USER_ROLE_LABEL_OFFICIAL}
            </SelectItem>
            <SelectItem value={USER_ROLE_NAME_ADMIN}>
              {USER_ROLE_LABEL_ADMIN}
            </SelectItem>
          </SelectContent>
        </Select>
        {!isPasswordSet ? (
          <Button onClick={handleSubmit}>Utwórz konto</Button>
        ) : (
          <NewPasswordDetails newPassword={newPassword} />
        )}
      </div>
    </div>
  );
}
