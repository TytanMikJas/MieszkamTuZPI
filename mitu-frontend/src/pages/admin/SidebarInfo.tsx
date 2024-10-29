import { useAdminStore } from '@/core/stores/admin-store';
import PanelButton from '@/reusable-components/panel-button/PanelButton';
import { ADMIN_CREATE_STAGE } from '@/strings';

export default function SidebarInfo() {
  const { setStage } = useAdminStore();
  const handleCreateStage = () => {
    setStage(ADMIN_CREATE_STAGE);
  };
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <PanelButton
        text="Dodaj użytkownika"
        icon="person_add"
        onClick={handleCreateStage}
      />
    </div>
  );
}
