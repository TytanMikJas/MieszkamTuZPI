import { Role } from '@/core/auth/roles';
import { useAdminStore } from '@/core/stores/admin-store';
import CrossIcon from '@/reusable-components/icons/cross-icon/CrossIcon';
import MailIcon from '@/reusable-components/icons/mail-icon/MailIcon';
import SettingsIcon from '@/reusable-components/icons/settings-icon/SettingsIcon';
import UserInfo from '@/reusable-components/misc/user-info/UserInfo';
import PanelButton from '@/reusable-components/panel-button/PanelButton';
import { Button } from '@/shadcn/button';
import { ADMIN_NONE_STAGE } from '@/strings';
import { userRoleParser } from '@/utils';
import GeneratePassword from './GeneratePassword';

export default function UserDetails() {
  const { selectedUser, setStage, setSelectedUser } = useAdminStore();
  const handleDeselectUser = () => {
    setSelectedUser(null);
  };
  const handleCloseStage = () => {
    setStage(ADMIN_NONE_STAGE, handleDeselectUser);
  };

  const handleMailTo = () => {
    window.open(`mailto:${selectedUser?.email}`);
  };

  return (
    selectedUser && (
      <div className="w-full h-full flex gap-4 flex-col justify-center items-center relative">
        <div className="absolute right-0 top-0">
          <CrossIcon size={40} onClick={handleCloseStage} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="p-4 rounded-lg shadow min-w-96 gap-2 flex flex-col">
            <div className="flex items-center justify-between p-2">
              <UserInfo
                url={selectedUser.avatar}
                fullName={selectedUser.firstName + ' ' + selectedUser.lastName}
                verified={selectedUser.role === Role.OFFICIAL}
              />
            </div>
            <div className="flex items-center gap-2 px-3">
              <SettingsIcon />
              {userRoleParser[selectedUser.role]}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {selectedUser.role === Role.OFFICIAL && (
              <GeneratePassword user={selectedUser} />
            )}
          </div>
        </div>
      </div>
    )
  );
}
