import UserPublicDto, {
  UserPublicExtendedDto,
} from '@/core/api/admin/UserPublicDto';
import { Role } from '@/core/auth/roles';
import { useAdminStore } from '@/core/stores/admin-store';
import SettingsIcon from '@/reusable-components/icons/settings-icon/SettingsIcon';
import UserInfo from '@/reusable-components/misc/user-info/UserInfo';
import { ADMIN_DETAILS_STAGE } from '@/strings';
import { userRoleParser } from '@/utils';

export default function UserCard({ user }: { user: UserPublicExtendedDto }) {
  const { getIsSelected, setSelectedUser, setStage } = useAdminStore();

  const handleSetSelectedUser = () => {
    setSelectedUser(user);
  };
  const handleSelect = () => {
    setStage(ADMIN_DETAILS_STAGE, handleSetSelectedUser);
  };
  const isSelected = getIsSelected(user.id);

  return (
    <div
      onClick={handleSelect}
      className={`flex flex-col rounded-lg shadow gap-2 p-2 cursor-pointer hover:bg-gray-100 duration-1 ease-in active:bg-gray-200 ${isSelected ? 'bg-blue-100' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between p-2">
        <UserInfo
          url={user.avatar}
          fullName={user.firstName + ' ' + user.lastName}
          verified={user.role === Role.OFFICIAL}
        />
        <div className="font-bold text-primary">{user.lastName[0]}</div>
      </div>
      <div className="flex items-center gap-2 px-4">
        <SettingsIcon size={20} />
        {userRoleParser[user.role]}
      </div>
    </div>
  );
}
