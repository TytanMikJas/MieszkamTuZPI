import { useAdminStore } from '@/core/stores/admin-store';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import { useEffect } from 'react';
import UserCard from './UserCard';

export default function UserList() {
  const { userList, loadingList, fetchUserList } = useAdminStore();

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <div className="w-full h-full scrollable-vertical relative">
      {loadingList && (
        <div className="absolute top-0 left-0">
          <PanelLoader />
        </div>
      )}
      <div className="grid grid-cols-2 gap-10 p-4 w-full">
        {userList.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </div>
    </div>
  );
}
